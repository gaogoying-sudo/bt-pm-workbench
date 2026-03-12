# BT PM Workbench

## 1. 项目简介
BT PM Workbench（代号：PM-WORKBENCH）是内部使用的项目管理 / 项目治理工作台，用于多项目、多版本并行协作场景下的边界控制与治理。

## 2. 当前项目定位
- 这是新项目
- 这是内部管理工作台，不是客户交付页
- 这不是客户端主站
- 这不是菜谱解析专项线默认后续
- 这不是旧工作台项目自动延伸

## 3. 当前阶段目标
v0 先构建可运行、可扩展的工程骨架：页面框架 + 类型系统 + mock 数据 + 治理文档。

## 4. 技术栈
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ESLint + Prettier

## 5. 启动方式
```bash
npm install
npm run dev
```
默认访问 `http://localhost:3000/dashboard`。

## 6. 目录结构说明
- `src/app`: 页面路由
- `src/components`: 布局与通用 UI 组件
- `src/data`: mock 数据源
- `src/lib/types`: 核心领域类型
- `docs/governance`: 治理文档
- `docs/product`: 产品信息架构与路线图
- `docs/records`: 变更与版本记录入口

## 7. 页面结构说明
- Dashboard
- Projects
- Project Detail
- Tasks
- Versions
- Docs Index
- Change Log
- References
- Settings / Governance

## 8. 数据结构说明
已定义核心类型：
- `Project`
- `Task`
- `VersionRecord`
- `DocumentRecord`
- `ChangeRecord`
- `ReferenceRecord`

## 9. 治理规则摘要
- 默认隔离，不自动继承旧项目上下文
- 引用旧成果必须进入候选清单并审批
- 版本链独立起算并维护当前有效版本
- 文档按生效状态与读取顺序管理

## 10. 后续迭代方向
- 接入真实 API 与数据源
- 强化筛选、搜索、分页
- 增加协作流、审批流、权限与审计能力
