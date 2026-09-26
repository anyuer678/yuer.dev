---
title: 判题沙箱演进：从 136 行黑名单到 ns/cgroup/白名单
date: 2026-09-26
tags: [安全, Linux, seccomp, cgroup, 沙箱]
type: project
summary: 黑名单在结构上就是错的：内核新增 syscall 时缺省放行。记录判题沙箱三层演进——seccomp 白名单、cgroup v2、ns+jail，以及 CI 抓出的 12 个真 bug。
---

## 引言：我的判题沙箱曾经只有 136 行 C

[PolyCodeHub](https://github.com/anyuer678/polycodehub) 里最核心的安全组件，是一个 136 行的 C 程序：`sandbox_netblock`。它用 libseccomp 维护一张**黑名单**——默认放行所有 syscall，只定向拒绝网络、ptrace、mount、io_uring、bpf 等十几类危险调用。

它的 README 里诚实地写着：*"沙箱为黑名单进程级隔离，非多租户容器。"* 这句话挂了两个月。每次看到它我都知道两件事：一，这个自评是诚实的；二，**黑名单在结构上就是错的**——内核新增 syscall 时黑名单缺省放行，你永远在追赶攻击面。

这篇文章记录我把它演进到"接近 go-judge / NSJail 级别隔离"的完整过程：三个 PR、五轮对抗 CI、12 个真实 bug。

**最终形态**：用户代码运行在一个 tmpfs 最小根文件系统的 chroot jail 里，NET/PID/MOUNT 三层 namespace 隔离，cgroup v2 按"每一次判题"硬性限制进程数与内存，seccomp 白名单只放行 trace 实测过的 syscall——宿主文件系统、宿主进程、网络三层全部不可见。

## 一、起点：三层旧防线与它们的缺口

演进前的执行链路：

```
engine（root，worker）
  → sandbox_helper.py（root：设置 rlimit → fork → setuid 降权到 uid 1002）
    → sandbox_netblock（uid 1002：seccomp 黑名单）
      → exec 用户代码
```

| 防线 | 它做什么 | 缺口 |
|------|----------|------|
| setuid + 补充组清空 | 降权到无 shell 的 sandbox 用户 | 进程仍能看到宿主整个文件系统、全部宿主进程 |
| seccomp 黑名单 | 拒绝十几类危险 syscall | 缺省放行；新 syscall = 新攻击面 |
| rlimit（AS/CPU/NPROC） | 限制虚拟内存 / CPU / 进程数 | NPROC 按**用户**全局计数——多 worker 并发判题时互相污染（后面细说） |

这些缺口不是我不知道，而是**当时没有更好的选择**。补齐它们需要回答三个问题：白名单名单从哪来？按判题的资源隔离怎么做？不依赖 Docker 的文件系统/进程隔离怎么做？

## 二、第一层：seccomp 从黑名单到白名单

### 名单从哪来：trace 驱动，不靠背

白名单最难的不是写 filter，而是回答"这个语言运行时到底需要哪些 syscall"。漏一个就是线上偶发 RE。方案是用数据回答：

1. `trace_syscalls.sh`：`strace -f -qq` 跑代表性判题负载，提取 syscall 名集合；
2. `gen_whitelist.py`：`BASELINE ∪ trace − EXCLUDE` 合成 profile 表，输出 C 头文件，确定性排序保证重复生成无 diff 噪音；
3. `sandbox_netblock.c` 读取 profile，默认动作 `SCMP_ACT_ERRNO(EPERM)`，逐名放行。

两个设计决定值得单独说：

**`socket` 永不进白名单。** 网络隔离不能靠"把 socket 排除在名单外"——那 AF_UNIX 的进程间通信也没了。正确做法是带参数过滤：仅允许 `AF_UNIX` 域，INET/INET6/NETLINK 维持默认拒绝：

```c
if (seccomp_rule_add(ctx, SCMP_ACT_ALLOW, SCMP_SYS(socket), 1,
                     SCMP_A0(SCMP_CMP_EQ, AF_UNIX)) != 0) { /* fail */ }
```

**目标内核不存在的名字跳过而非报错。** `seccomp_syscall_resolve_name` 解析失败说明内核没有这个 syscall——不存在即无攻击面，跳过并打 warning。

### CI 首轮实测抓到的四个 bug

白名单第一版名单是"人工整理的 curated bootstrap"，然后让 adversarial CI 在真实 ubuntu runner 上验证。首轮就抓了四个：

**① clone3 缺失 → node 直接 SIGABRT。** node 的 `WorkerThreadsTaskRunner` 起线程走 `clone3`，而现代 glibc 在 seccomp 返回 **EPERM 时不会像 ENOSYS 那样回退到 clone**——pthread_create 失败，进程直接死。修法是清醒的妥协：把 `clone`/`clone3` 加入基线。这不是放宽——**黑名单模式本来就放行 clone 系**，白名单只是追平历史行为；fork 炸弹防护由 rlimit NPROC（以及后面的 cgroup pids.max）接管。

**② 测试断言被 print 掩盖。** ptrace 拒绝用例断言 `rc != 0`——但用户代码里 `print(libc.ptrace(...))` 会把 `-1` 打印出来、进程正常退出 rc=0。正确姿势是 `use_errno=True` + 断言返回值 `-1` 和 `errno == EPERM`。教训：**测"被拒绝"要测 syscall 的返回值和 errno，不要测进程退出码。**

**③ pytest 的 tmp_path 是 root 私有目录。** jail 外编译的 C 二进制放进去，sandbox 用户连目录都穿越不了 → execve EACCES。这不是沙箱 bug，是测试环境 bug——但两者表现一模一样。

**④ java 名单无法在 CI 验证。** runner 的 temurin 缺 server JVM。处理方式不是硬编造名单，而是把 `java`/`build-java` 标注为 **experimental**，测试用环境变量显式门控，THREAT_MODEL 里如实写"未 CI 实证"。

方法论总结：**curated 名单只用来让 CI 转起来，充分性必须由真实 trace 背书。** 现在 adversarial workflow 会在跑测试前用 strace 实测采集并现场重新生成名单——名单的每一次"够用"都有数据背书。

## 三、第二层：cgroup v2 按判题隔离

### 一个写在注释里的老 bug

旧代码里有一段 fail-visible 逻辑：setuid 之后设置 `RLIMIT_NPROC` 失败就退出 125，注释还解释了为什么多 worker 并发时会失败——"sandbox 用户已有其他子进程，setrlimit 会因进程数超过新软限制而失败"。

写的时候觉得自己处理得很体面。做 cgroup 层时才意识到：**这段注释描述的不是边界情况，是根源性设计错误**。`RLIMIT_NPROC` 按**用户**计数：uid 1002 的所有进程、跨所有 worker 汇总。并发 8 个判题时，每个判题的"fork 炸弹防护"互相污染。

`cgroup v2` 的 `pids.max` 才是正确语义：**按判题（cgroup 实例）计数**。每个判题建独立 cgroup，`pids.max`、`memory.max` 各自独立，互不可见。

### memory.peak 和 oom_kill：两个盲区的补齐

旧方案用 `wait4` 取子进程自身 `ru_maxrss`，有两个盲区：**page cache 不可见**（写大文件刷 cache，RSS 不涨但物理内存压力真实存在）；**OOM 死亡无证据**（cgroup OOM kill 表现为 SIGKILL，只能当普通崩溃处理）。

cgroup 层全部有显式答案：`memory.max` 硬上限；`memory.peak` 含 page cache 的历史峰值；`memory.events` 的 `oom_kill` 计数器给出"这次死亡就是 OOM"的**显式证据**。helper 写标记行回传，engine 只信任 stderr 末两行（用户输出永远在标记之前，伪造行无法到达信任位置），`oom_kill > 0 且 rc≠0` → 判 MLE。

### 模式分级：off / auto / require

cgroup 需要**可写委托**。GitHub runner 的 cgroup 根不可委托（诊断步实锤：mkdir 被拒），所以设计成三档：`off`（默认）/ `auto`（可用即用，否则打 warning 回退纯 rlimit）/ `require`（必须可用，不可用直接抛错）。**降级必须可见，能力必须可校验。**

## 四、第三层：namespaces + 最小根文件系统

目标：让用户代码**看不见宿主的文件系统、进程表和网络**。不用 Docker（judge 自己就跑在容器里），不用 user namespaces（刻意避开 userns 攻击面），全部手写。`SB_NS=1` 时 netblock 以 root 依次：

```
unshare(CLONE_NEWNET)     空网络栈：连 loopback 都不存在
unshare(CLONE_NEWPID)     本进程成为 ns 内 PID 1……的前提（见陷阱①）
unshare(CLONE_NEWNS) + MS_PRIVATE
构建 jail 根（tmpfs）：
    /usr,/lib,/lib64,/bin  只读 bind
    /etc 最小文件集         只读 bind（ld.so.cache、nsswitch、hosts、passwd…）
    判题工作目录            按原路径 RW bind（argv 绝对路径保持有效！）
    /tmp tmpfs(1777)  /dev tmpfs+最小节点  /proc（ns 内挂载）
chroot → setgroups([])/setgid/setuid → prctl(NNP) → seccomp → exec
```

### 四个教科书级陷阱（全部由 adversarial CI 实测暴露）

**① CLONE_NEWPID 不会重编号调用者。** 我以为 `unshare(CLONE_NEWPID)` 后 exec 用户代码，用户代码就是 ns 内 PID 1。实际是：unshare 只"准备"了新 PID ns，**调用者还留在宿主 ns，ns 内 PID 1 是下一个 fork 出来的子进程**。正确做法：netblock fork——子进程继续 jail 内流程（它才是 ns 内 PID 1），父进程 waitpid 守候并把退出状态/信号原样回传（SIGXCPU 的 TLE 语义靠这个保住）。

**② procfs 绑定的是【挂载者】的 PID namespace。** 修完 ① 之后测试仍然看到 174 个宿主进程。原因：/proc 是在 fork **之前**、由父进程挂载的——procfs 绑定的是挂载者的 pid ns，而 `unshare(CLONE_NEWPID)` 的调用者自己**还在宿主 PID ns 里**。/proc 必须挪到 fork 之后的子进程里挂载。

**③ chroot 之后的 cwd 是一个"孤儿 dentry"。** chroot 不改变进程的 cwd——此时 cwd 还指向宿主的判题工作目录（jail 内有同路径 RW bind）。如果顺手 `chdir("/")`，cwd 就落在 jail 根的 tmpfs 上（root 所有、0755），降权后的用户写任何相对路径都是 EACCES。正确做法：chroot 后 `chdir` 到 **jail 内的工作目录 bind 点**。顺带，把工作目录按**原路径** bind 而不是发明 `/workspace` 固定路径，让 engine 的 argv（编译产物绝对路径）零改动——**jail 尊重宿主的路径拓扑，而不是发明新的**。

**④ 挂载顺序覆盖。** `/tmp` 的 tmpfs 如果在工作目录 bind **之后**挂载（工作目录在 /tmp 之下），会把工作目录的 bind 整个盖住——用户代码报"找不到 user.py"，而 strace 里 mount 全部成功。挂载顺序是 rootfs 构建正确性的一部分。

### 相对路径 execvp：strace 下的完整路径搜索

调试期间最有教育意义的一条 strace——jail 内 `execvp("python3")` 的完整 PATH 搜索：

```
execve("/opt/hostedtoolcache/Python/3.12.14/x64/python3", ...) = -1 ENOENT
execve("/snap/bin/python3", ...)      = -1 ENOENT
execve("/usr/local/bin/python3", ...) = -1 ENOENT
execve("/usr/sbin/python3", ...)      = -1 ENOENT
execve("/usr/bin/python3", ...)       = 0        ← 命中
```

每一条 ENOENT 都在提醒你：**PATH 里的每一个目录都是一份"宿主拓扑假设"**。jail 构建的本质，就是把这份假设裁剪到只剩运行时需要的那部分——并且保证裁剪后的路径仍然可达。

## 五、验证体系：对抗 CI 是这一路上唯一的裁判

整个演进过程中，我没有一次"本地跑通了就算"。每一次提交都经过同一条 adversarial workflow（root + libseccomp + sandbox 用户 + 真实内核），覆盖：

- **黑名单回归**：INET socket / ptrace / 写系统路径 / fail-closed——保证每层新增不破坏旧防线；
- **白名单充分性**：python/c/node 在名单内真实运行（跑不起来就是名单漏了）；
- **白名单对抗**：INET socket 与 ptrace 仍被拒、AF_UNIX 可用、未知 profile 退出 125；
- **cgroup 语义**：fork 炸弹被 pids.max 拦截、OOM 有 oom_kill 证据、并发判题互不污染；
- **ns/jail**：PID=1、/proc 隔离、/etc/shadow 不存在、网络拒绝、工作目录可写、ns+cgroup 组合的 fork 炸弹。

12 个 bug 里，没有一个是我"review 出来"的——全部是这条流水线抓的。**安全代码的测试不是测"功能对不对"，而是测"攻击面在不在"。前者可以自评，后者必须让对抗用例说话。**

## 六、诚实边界与对照

| 维度 | 本项目沙箱 | go-judge | NSJail |
|------|-----------|----------|--------|
| 隔离层次 | setuid + seccomp 白名单 + cgroup v2 + NET/PID/MOUNT ns + chroot jail | namespace + cgroup + seccomp 全套 | namespace + cgroup + seccomp，通用 jail 工具 |
| 根文件系统 | tmpfs 最小根 + RO bind | 完整镜像 per language | 挂载表配置驱动 |
| 网络隔离 | 空 netns + socket 域过滤 + 名单 | netns 隔离 | netns 隔离 |
| 资源限制 | rlimit + cgroup v2（pids/memory） | cgroup 全套 | cgroup 全套 |
| 多租户 | ❌ 单宿主单用户（自评） | ✅ 生产级 | 视部署 |
| 独立安全审计 | ❌ 未做 | 社区规模验证 | 广泛使用 |

**如实定位**：功能层次上补齐了 namespace/cgroup/白名单三大件，与成熟工具的设计空间重叠；差距在**成熟度**——没有独立审计、没有大规模并发验证、java 编译名单仍是 experimental、`cpu.max` 刻意未启用（避免与 RLIMIT_CPU 的 SIGXCPU 语义产生双层判定歧义）。这些全部写在仓库的 [THREAT_MODEL.md](https://github.com/anyuer678/polycodehub/blob/main/THREAT_MODEL.md) 里，**包括那些还没修的**。

## 结语

136 行黑名单不是耻辱——它是诚实的起点。耻辱的是挂着"非多租户"的自评躺平两个月。

三个 PR 走下来，我对"安全边界"的理解变了：它不是一个开关，而是**一叠可以被测试证明的承诺**。每一层缓解措施旁边都躺着一行"已证明"或"未证明"，而那行字的诚实程度，就是这个项目的工程质量。

> 姊妹篇：[《判题沙箱的 12 个真 bug》](/yuer.dev/notes/sandbox-pitfalls-notes/)——四个最有代表性的坑的深度拆解。
> 沙箱相关代码：`services/judge-service-python/`（`sandbox_netblock.c` / `sandbox_helper.py` / `app/cgroup.py` / `scripts/gen_whitelist.py`），
> 安全文档：[THREAT_MODEL.md](https://github.com/anyuer678/polycodehub/blob/main/THREAT_MODEL.md) / [SANDBOX_TESTING.md](https://github.com/anyuer678/polycodehub/blob/main/docs/SANDBOX_TESTING.md)。
