import {
  DeliverableQualityRecord,
  QualityCheckRecord,
  QualityGateDefinition,
  QualityIssueRecord
} from '@/lib/types/quality';

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

export const deliverableQualityRecords: DeliverableQualityRecord[] = [
  {
    id: 'dq-001',
    projectId: 'project-pm-workbench',
    stageId: 'stage-pmw-3',
    linkedVersionId: 'version-pmw-0.1',
    deliverableType: 'tech-design',
    title: '聚合链路与 API 合约 Tech Design',
    ownerId: 'person-chen',
    reviewStatus: 'passed',
    severity: 'major',
    reviewedAt: '2026-03-12',
    notes: '覆盖 unified project、write-back chain、API response shape。'
  },
  {
    id: 'dq-002',
    projectId: 'project-ops-console',
    stageId: 'stage-ops-2',
    linkedVersionId: 'version-ops-0.3',
    deliverableType: 'prd',
    title: '告警聚合 PRD 评审',
    ownerId: 'person-li',
    reviewStatus: 'in-review',
    severity: 'major',
    reviewedAt: null,
    notes: '部分边界条件仍待补充。'
  }
];

export const qualityIssueRecords: QualityIssueRecord[] = [
  {
    id: 'qi-001',
    projectId: 'project-pm-workbench',
    stageId: 'stage-pmw-4',
    linkedVersionId: 'version-pmw-0.1',
    title: '缺少 e2e 跑通路径与最小回归集',
    status: 'open',
    severity: 'minor',
    createdAt: '2026-03-12',
    closedAt: null,
    notes: 'Phase 2 收口后补最小回归用例。'
  },
  {
    id: 'qi-002',
    projectId: 'project-ops-console',
    stageId: 'stage-ops-2',
    linkedVersionId: 'version-ops-0.3',
    title: '部分 release readiness 口径未统一',
    status: 'mitigating',
    severity: 'major',
    createdAt: '2026-03-08',
    closedAt: null,
    notes: '已在 version-governance builder 中补充统一字段，待评审关闭。'
  }
];
