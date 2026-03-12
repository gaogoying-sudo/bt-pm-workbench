import { ChangeRecord } from '@/lib/types/domain';

export const changes: ChangeRecord[] = [
  { id: 'C-001', projectId: 'pm-workbench', target: '项目范围', changeType: 'scope', summary: '明确第一阶段仅做前端壳子', impactScope: 'dashboard,projects,tasks', versionImpact: 'major', taskImpact: 'full', status: 'implemented', updatedAt: '2026-03-12' },
  { id: 'C-002', projectId: 'pm-workbench', target: '任务状态', changeType: 'requirement', summary: '增加已归档状态', impactScope: 'tasks', versionImpact: 'minor', taskImpact: 'partial', status: 'approved', updatedAt: '2026-03-11' },
  { id: 'C-003', projectId: 'pm-workbench', target: '文档规则', changeType: 'document', summary: '增加读取顺序字段', impactScope: 'docs-index', versionImpact: 'minor', taskImpact: 'partial', status: 'implemented', updatedAt: '2026-03-11' },
  { id: 'C-004', projectId: 'pm-workbench', target: '版本策略', changeType: 'version', summary: '增加当前有效版本唯一性说明', impactScope: 'versions,settings', versionImpact: 'major', taskImpact: 'partial', status: 'reviewing', updatedAt: '2026-03-12' },
  { id: 'C-005', projectId: 'ops-console', target: '告警卡片', changeType: 'task', summary: '增加风险等级字段', impactScope: 'dashboard', versionImpact: 'minor', taskImpact: 'partial', status: 'open', updatedAt: '2026-03-10' },
  { id: 'C-006', projectId: 'client-portal', target: '角色矩阵', changeType: 'requirement', summary: '外部角色被压缩', impactScope: 'auth,docs', versionImpact: 'major', taskImpact: 'full', status: 'reviewing', updatedAt: '2026-03-09' },
  { id: 'C-007', projectId: 'data-migration', target: '审计流程', changeType: 'scope', summary: '仅保留问题修复', impactScope: 'workflow', versionImpact: 'minor', taskImpact: 'partial', status: 'approved', updatedAt: '2026-02-26' },
  { id: 'C-008', projectId: 'pm-workbench', target: '引用策略', changeType: 'document', summary: '补充显式批准前不得带入规则', impactScope: 'references,settings', versionImpact: 'minor', taskImpact: 'none', status: 'implemented', updatedAt: '2026-03-12' }
];
