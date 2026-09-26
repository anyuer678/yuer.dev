---
title: 判题沙箱的 12 个真 bug：CI 抓出来的四个经典坑
date: 2026-09-26
tags: [安全, Linux, seccomp, 调试]
type: project
summary: 对抗性 CI 在沙箱演进中实测抓出 12 个真 bug。拆解四个最有代表性的：clone3 无回退、CLONE_NEWPID 不重编号调用者、procfs 绑定挂载者的 ns、挂载顺序覆盖工作目录。
---

给 [PolyCodeHub](https://github.com/anyuer678/polycodehub) 的判题沙箱做三层演进（seccomp 黑名单→白名单、rlimit→cgroup v2、+ NET/PID/MOUNT ns 与 chroot jail）的过程里，**对抗性 CI 在真实内核上抓出了 12 个 bug**——没有一个是我 review 出来的，全部是逃逸/越权/资源用例当场拦截的。这篇拆解四个最有代表性的，演进全貌见姊妹篇[《判题沙箱演进》](https://anyuer678.github.io/yuer.dev/notes/polycodehub-sandbox-notes/)。

## 坑一：clone3 在 seccomp 下没有回退

白名单上线后，node 一启动就 SIGABRT，栈指向 `WorkerThreadsTaskRunner`。原因：node 起工作线程走 `clone3`，而现代 glibc 在 clone3 失败时**只对 ENOSYS 回退到 clone**——seccomp 返回的 EPERM 不触发回退，pthread_create 直接失败。

第一反应是"那把 clone3 也放行"。但要想清楚：黑名单模式本来就放行 clone 系，白名单放行它只是**追平历史行为**，fork 炸弹防护由 rlimit NPROC / cgroup pids.max 承担。安全设计里，"回退到与旧防线同级"和"引入新风险"是两回事。

顺带一个测试教训：ptrace 拒绝用例断言 `rc != 0`——但用户代码里 `print(libc.ptrace(...))` 会把 `-1` 打出来、进程正常退出 rc=0，断言必挂。**测"被拒绝"要测 syscall 的返回值和 errno（`use_errno=True`），不要测进程退出码。**

## 坑二：CLONE_NEWPID 不会重编号调用者

我写 `unshare(CLONE_NEWPID)` 之后 exec 用户代码，然后断言"用户代码是 ns 内 PID 1"——测试当场失败，`getpid()` 返回的是宿主 pid。

**CLONE_NEWPID 只"准备"新 PID ns，调用者自己留在宿主 ns，ns 的 PID 1 是下一个 fork 出来的子进程。** 正确结构：netblock fork，子进程继续 chroot/降权/seccomp/exec（它才是 PID 1），父进程 waitpid 并把退出状态/信号原样回传给上层（SIGXCPU 判 TLE 的语义靠这个保住）。

## 坑三：procfs 绑定的是【挂载者】的 PID namespace

修完坑二，测试仍然看到 174 个宿主进程。原因：/proc 是我在 fork **之前**、由父进程挂载的——procfs 绑定的是**挂载者所在**的 pid ns，而坑二说过，那个调用者还在宿主 ns 里。

修法：/proc 必须挪到 fork 之后的 ns 内子进程里挂载。这是"同一个 syscall，挂载者不同、语义完全不同"的典型案例。

## 坑四：挂载顺序覆盖 + chroot 后的 cwd

两个连着的小坑：

- 工作目录 bind 在 `/tmp` 之下，而我把 `/tmp` 的 tmpfs 挂在它**后面**——整个工作目录被覆盖，用户代码报"找不到文件"，strace 里 mount 却全部成功；
- `chroot` 不改变 cwd，但**chroot 后顺手 `chdir("/")` 会把 cwd 重置到 jail 根**（root 所有、0755）——降权后的用户写任何相对路径都是 EACCES。正确做法是 chdir 到工作目录在 jail 内的同路径 bind 点。

这也解释了为什么工作目录要按**原路径** bind 而不是发明 `/workspace`：argv 里的编译产物绝对路径保持有效，上层代码零改动。**jail 尊重宿主的路径拓扑，而不是发明新的。**

## 附：一条 strace 的教育意义

jail 内 `execvp("python3")` 的完整 PATH 搜索（strace 截取）：

```
execve("/opt/hostedtoolcache/Python/3.12.14/x64/python3", ...) = -1 ENOENT
execve("/snap/bin/python3", ...)      = -1 ENOENT
execve("/usr/local/bin/python3", ...) = -1 ENOENT
execve("/usr/bin/python3", ...)       = 0        ← 命中
```

每一条 ENOENT 都在提醒你：**PATH 里的每一个目录都是一份"宿主拓扑假设"**。jail 构建的本质，就是把这份假设裁剪到只剩运行时需要的那部分——并且保证裁剪后的路径仍然可达。

## 方法论

12 个 bug 里没有一个是我"review 出来"的。安全代码的测试不是测"功能对不对"，而是测"攻击面在不在"——前者可以自评，后者必须让对抗用例（逃逸/越权/资源耗尽，跑在 root + 真实内核上）说话。另外：白名单第一版是人工整理的，我不相信它——workflow 现在会在跑测试前用 strace 实测采集各语言的 syscall 集合并现场重新生成名单，"名单够用"这件事永远有数据背书。

> 演进全貌（含 cgroup 老 bug 分析、go-judge/NSJail 对照表）：[《判题沙箱演进》](https://anyuer678.github.io/yuer.dev/notes/polycodehub-sandbox-notes/)
> 仓库：[PolyCodeHub](https://github.com/anyuer678/polycodehub) · 安全文档：THREAT_MODEL.md / docs/SANDBOX_TESTING.md
