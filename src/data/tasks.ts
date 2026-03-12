import { Task } from '@/lib/types/domain';

export const tasks: Task[] = [
  { id: 'T-001', title: '定义项目治理基线', description: '完成治理文档首版结构', projectId: 'pm-workbench', module: 'governance', priority: 'critical', status: 'completed', owner: 'Alice', blocker: '-', nextAction: '同步到评审会', updatedAt: '2026-03-12' },
  { id: 'T-002', title: '搭建导航与布局', description: '实现左侧导航和顶栏', projectId: 'pm-workbench', module: 'ui-shell', priority: 'high', status: 'in-progress', owner: 'Bob', blocker: '-', nextAction: '补充响应式细节', updatedAt: '2026-03-12' },
  { id: 'T-003', title: 'Projects 页面筛选占位', description: '添加状态筛选与搜索框', projectId: 'pm-workbench', module: 'projects', priority: 'medium', status: 'pending-confirmation', owner: 'Carol', blocker: '-', nextAction: '确认筛选字段', updatedAt: '2026-03-11' },
  { id: 'T-004', title: '版本链可视化方案', description: '明确版本关系展示方式', projectId: 'pm-workbench', module: 'versions', priority: 'high', status: 'blocked', owner: 'David', blocker: '缺少设计决策', nextAction: '组织评审', updatedAt: '2026-03-11' },
  { id: 'T-005', title: '文档读取优先级定义', description: '建立文档 readOrder 规则', projectId: 'pm-workbench', module: 'docs-index', priority: 'high', status: 'not-started', owner: 'Eve', blocker: '-', nextAction: '起草 policy', updatedAt: '2026-03-10' },
  { id: 'T-006', title: '候选引用审核流程', description: '定义 approved/rejected 流转', projectId: 'pm-workbench', module: 'references', priority: 'medium', status: 'not-started', owner: 'Frank', blocker: '-', nextAction: '输出流程图', updatedAt: '2026-03-10' },
  { id: 'T-007', title: '告警汇总卡片改版', description: '优化告警摘要信息', projectId: 'ops-console', module: 'dashboard', priority: 'medium', status: 'in-progress', owner: 'Grace', blocker: '-', nextAction: '接入 mock API', updatedAt: '2026-03-10' },
  { id: 'T-008', title: '交付门户权限核对', description: '核对客户角色矩阵', projectId: 'client-portal', module: 'auth', priority: 'high', status: 'blocked', owner: 'Henry', blocker: '客户未确认角色', nextAction: '等待客户回复', updatedAt: '2026-03-09' },
  { id: 'T-009', title: '迁移日志归档', description: '封板项目归档补录', projectId: 'data-migration', module: 'records', priority: 'low', status: 'archived', owner: 'Iris', blocker: '-', nextAction: '-', updatedAt: '2026-02-26' },
  { id: 'T-010', title: '清理历史链接', description: '修正历史文档死链', projectId: 'archive-cleanup', module: 'docs', priority: 'low', status: 'completed', owner: 'Jack', blocker: '-', nextAction: '-', updatedAt: '2025-12-15' },
  { id: 'T-011', title: 'Dashboard 风险卡片', description: '补充风险信息占位', projectId: 'pm-workbench', module: 'dashboard', priority: 'medium', status: 'completed', owner: 'Alice', blocker: '-', nextAction: '后续接入真实规则', updatedAt: '2026-03-12' },
  { id: 'T-012', title: '任务状态枚举校验', description: '统一任务状态定义', projectId: 'pm-workbench', module: 'tasks', priority: 'high', status: 'cancelled', owner: 'Bob', blocker: '方案变更', nextAction: '按新方案重开任务', updatedAt: '2026-03-09' }
];
