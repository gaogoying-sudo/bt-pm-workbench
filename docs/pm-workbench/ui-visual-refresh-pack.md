# 全站视觉重构与中文化统一包（Visual Refresh Pack）

目标：把系统从“能跑但丑、工程味重、英文干扰强”统一到一版**浅蓝主调、克制耐看、中文优先、信息层级清晰、图标统一**的产品观感。  
边界：**不改路由结构、不改数据域、不改读写链路、不改业务逻辑**，仅做主题/排版/组件/页面布局与文案收口。

## 1) 主题与层次（浅蓝 + 暗部层次）

- **主题 tokens（CSS 变量）**：见 `src/app/globals.css` 的 `--pmw-*`。
  - 背景为浅蓝低饱和渐变（避免大色块“炸”）
  - 卡片与关键区域通过 `--pmw-shadow` / `--pmw-shadow-sm` 做轻暗部层次
- **基础组件样式类**：
  - `.pmw-surface`：主卡片（白底、柔边框、轻阴影）
  - `.pmw-surface-muted`：次级卡片（浅蓝灰底、轻阴影）
  - `.pmw-btn` / `.pmw-btn-primary`：按钮统一（克制 hover，不做复杂动效）

## 2) 中文化策略（中文主，英文辅）

- **页面标题/描述**：`PageHeader` 支持中英拆分（`中文 / English`、`中文｜English` 等），渲染为：
  - 中文：主标题/主描述（更大、更深）
  - 英文：弱提示（更小、更浅）
- **本包优先改动**：主入口页与项目内页签标题统一改为**中文主标题**（如“输入收件箱”“数据交换”“版本治理”等）
- **允许保留**：少量技术字段或标识符（如 read model key、ID）用等宽/弱化展示，避免抢阅读

## 3) 图标系统（克制统一）

- **统一图标源**：`src/components/ui/icons.tsx`（线性、同尺寸、同描边）
- **已覆盖**：侧栏主入口、顶栏主入口、项目页签
- **原则**：图标只用于“入口识别 / 区块识别 / 状态识别”，不做装饰性堆叠

## 4) 基础组件重绘（全站共享）

- `Sidebar`：浅蓝信息牌 + 入口卡片化，去掉 legacy 入口暴露
- `Topbar`：半透明/毛玻璃、中文信息架构、主入口快捷跳转
- `PageHeader`：中文优先的标题与描述层级
- `InfoCard` / `StatusBadge`：更克制的低饱和状态色 + 轻阴影

## 5) 页面覆盖说明（本包已实质调整）

至少覆盖并确保观感一致：

- `/login`、`/me`、`/projects`、`/projects/new`
- `/projects/[projectId]` + `execution/progress/version/resources/reviews`
- `/input-inbox`、`/executive-dashboard`、`/data-exchange`
- `/profile`、`/admin`

## 6) 仍保持轻量处理（后续只能小任务）

- 复杂动效体系：只保留必要 hover/transition
- 组件库化：未引入新 UI 库依赖（避免扩大工程面）
- 个别业务 Workbench 内部仍存在工程化排版：本包只做“统一外壳 + 关键区块优先”

