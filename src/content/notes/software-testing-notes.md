---
title: 软件测试技术：Doctest、Unittest 与 Locust 压测
date: 2026-06-15
type: learning
tags: [软件工程, 实验, 测试, Python]
summary: 软件工程测试技术实验归纳：Doctest 文档测试、Unittest + Mock 单元测试与 coverage 覆盖率、Locust 性能压测。三种测试分别对应代码级、模块级、系统级验证。
---

## 三种测试的定位

| 测试 | 级别 | 工具 | 验证什么 |
|---|---|---|---|
| Doctest | 代码级 | Python 标准库 | 函数示例与文档一致 |
| Unittest | 模块级 | unittest + Mock + coverage | 单元行为正确、覆盖率 |
| Locust | 系统级 | Locust（协程压测） | 高并发下的响应/吞吐/错误率 |

## Doctest：文档即测试

在函数 docstring 里写交互式会话，`python -m doctest -v` 执行并比对输出：

```python
def add(a, b):
    """加法函数，用于Doctest测试
    >>> add(1, 2)
    3
    >>> add(-1, 1)
    0
    """
    return a + b
```

特点：测试与文档合一、无需额外测试文件、适合快速验证简单函数。实验里 add/multiply 各 3 组数据，6 个用例全部通过。

## Unittest + Mock：隔离依赖

**Mock 对象**替代真实依赖（网络请求、数据库），隔离被测代码：

```python
from unittest.mock import Mock

class MathAPI:
    def add(self, a, b): return a + b
    def divide(self, a, b):
        if b == 0: raise ValueError("除数不能为0")
        return a / b

class TestMathAPI(unittest.TestCase):
    def setUp(self):
        self.mock_api = Mock(spec=MathAPI)   # 按 MathAPI 接口造 Mock
        self.mock_api.add.return_value = 10
    def test_add_with_mock(self):
        result = self.mock_api.add(3, 7)
        self.assertEqual(result, 10)
        self.mock_api.add.assert_called_once_with(3, 7)  # 验证调用参数
```

要点：`setUp` 初始化环境、`test_` 开头的方法、断言方法（assertEqual/assertRaises）、`assert_called_once_with` 验证调用。

**coverage 覆盖率**：`coverage run test_mathAPI.py` + `coverage report -m`，统计已执行代码行占比，找出未覆盖分支补测试。

## Locust：性能压测

协程模型单机模拟上万并发。脚本定义用户行为与权重：

```python
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)   # 每次操作间隔 1-3 秒
    @task(3)                     # 权重 3
    def visit_home(self):
        self.client.get("/")
    @task(1)                     # 权重 1
    def query_courses(self):
        self.client.get("/api/courses")
```

配合 Flask 写的测试服务（首页 + `/api/courses` 接口），`locust -f performance.py --host=http://127.0.0.1:5050` 启动，Web 界面实时看响应时间、RPS、失败率。

**踩坑**：本地 8089 端口解析异常，Web 可视化打不开 → 用命令行日志 + 脚本配置核验结果。

## 分层测试思路

代码级（Doctest 快验证）→ 模块级（Unittest 保证行为）→ 系统级（Locust 评估承载）。测试不是"写完了才测"，而是开发过程中的质量门禁——配合覆盖率反馈，倒逼代码可测试、易维护。
