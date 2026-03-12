import { ReferenceRecord } from '@/lib/types/domain';

export const referenceRecords: ReferenceRecord[] = [
  { id: 'R-001', sourceProject: 'legacy-workbench', targetProject: 'pm-workbench', objectName: '旧导航结构', referenceScope: 'layout', purpose: '评估是否可复用信息分区', isReadOnly: true, excludedContent: '旧项目字段命名与权限逻辑', status: 'candidate', updatedAt: '2026-03-12' },
  { id: 'R-002', sourceProject: 'legacy-workbench', targetProject: 'pm-workbench', objectName: '版本状态映射表', referenceScope: 'versions', purpose: '核对状态枚举覆盖度', isReadOnly: true, excludedContent: '旧版本链ID体系', status: 'rejected', updatedAt: '2026-03-11' },
  { id: 'R-003', sourceProject: 'ops-console', targetProject: 'pm-workbench', objectName: '风险卡片字段', referenceScope: 'dashboard', purpose: '丰富风险展示占位', isReadOnly: true, excludedContent: '告警策略算法', status: 'approved', updatedAt: '2026-03-10' },
  { id: 'R-004', sourceProject: 'recipe-parser', targetProject: 'pm-workbench', objectName: '任务模版', referenceScope: 'tasks', purpose: '观察任务拆解方式', isReadOnly: true, excludedContent: '菜谱解析业务对象', status: 'candidate', updatedAt: '2026-03-09' },
  { id: 'R-005', sourceProject: 'client-portal', targetProject: 'pm-workbench', objectName: '文档目录样式', referenceScope: 'docs-index', purpose: '优化可读性', isReadOnly: true, excludedContent: '客户敏感字段', status: 'expired', updatedAt: '2026-02-20' },
  { id: 'R-006', sourceProject: 'archive-cleanup', targetProject: 'pm-workbench', objectName: '归档规则摘要', referenceScope: 'settings', purpose: '补充归档原则', isReadOnly: true, excludedContent: '历史项目明细', status: 'candidate', updatedAt: '2026-03-12' }
];
