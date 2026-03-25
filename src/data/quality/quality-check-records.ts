import { QualityCheckRecord, QualityGateDefinition } from '@/lib/types/quality';

export const qualityCheckRecords: QualityCheckRecord[] = [
  {
    id: 'qc-001',
    projectId: 'project-pm-workbench',
    stageId: 'stage-pmw-3',
    taskId: 'task-pmw-301',
    checkType: 'deliverable-review',
    title: '任务执行聚合层交付物评审',
    description: '检查 task-execution builder/selector/aggregator 的输出结构是否符合系统口径定义。',
    status: 'passed',
    severity: 'major',
    reviewerId: 'person-wang',
    checkedAt: '2026-03-10',
    resolvedAt: '2026-03-10',
    notes: '聚合口径已确认，write-back chain 结构通过评审。'
  },
  {
    id: 'qc-002',
    projectId: 'project-pm-workbench',
    stageId: 'stage-pmw-3',
    taskId: 'task-pmw-302',
    checkType: 'code-review',
    title: 'Builder 代码结构评审',
    description: '检查核心 builder 的可维护性和参数注入能力。',
    status: 'passed',
    severity: 'major',
    reviewerId: 'person-chen',
    checkedAt: '2026-03-11',
    resolvedAt: '2026-03-11',
    notes: 'Builder 参数化改造完成，结构可接受。'
  },
  {
    id: 'qc-003',
    projectId: 'project-pm-workbench',
    stageId: 'stage-pmw-4',
    taskId: null,
    checkType: 'test-coverage',
    title: '联调测试覆盖率检查',
    description: '评估当前阶段的关键链路测试覆盖情况。',
    status: 'pending',
    severity: 'minor',
    reviewerId: null,
    checkedAt: '2026-03-12',
    resolvedAt: null,
    notes: '等待测试框架就绪后执行。'
  },
  {
    id: 'qc-004',
    projectId: 'project-ops-console',
    stageId: 'stage-ops-2',
    taskId: 'task-ops-201',
    checkType: 'acceptance-criteria',
    title: '告警聚合验收标准确认',
    description: '确认告警聚合模块的验收标准是否被满足。',
    status: 'in-review',
    severity: 'major',
    reviewerId: 'person-li',
    checkedAt: '2026-03-08',
    resolvedAt: null,
    notes: '部分验收项待确认。'
  },
  {
    id: 'qc-005',
    projectId: 'project-pm-workbench',
    stageId: 'stage-pmw-3',
    taskId: 'task-pmw-305',
    checkType: 'documentation-completeness',
    title: '系统总纲文档完整性检查',
    description: '检查系统架构总纲文档是否覆盖全部已有模块。',
    status: 'passed',
    severity: 'info',
    reviewerId: 'person-wang',
    checkedAt: '2026-03-12',
    resolvedAt: '2026-03-12',
    notes: '文档已覆盖全部 8 层系统框架。'
  }
];

export const qualityGateDefinitions: QualityGateDefinition[] = [
  {
    id: 'qg-pmw-dev',
    projectId: 'project-pm-workbench',
    stageId: 'stage-pmw-3',
    gateName: '开发阶段质量门禁',
    requiredCheckTypes: ['deliverable-review', 'code-review'],
    passThreshold: 0.8,
    isBlocking: true,
    notes: '开发阶段必须通过交付物评审和代码评审方可进入联调。'
  },
  {
    id: 'qg-pmw-test',
    projectId: 'project-pm-workbench',
    stageId: 'stage-pmw-4',
    gateName: '联调测试质量门禁',
    requiredCheckTypes: ['test-coverage', 'acceptance-criteria', 'regression-check'],
    passThreshold: 0.9,
    isBlocking: true,
    notes: '联调阶段必须满足测试覆盖和验收标准。'
  }
];
