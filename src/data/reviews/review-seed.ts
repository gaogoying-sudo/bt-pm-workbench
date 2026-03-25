import { DecisionLogRecord, LessonLearnedRecord, ReviewRecord } from '@/lib/types/reviews';

const now = new Date().toISOString();

export const seededReviews: ReviewRecord[] = [
  {
    id: 'rev-001',
    reviewType: 'project-review',
    title: 'PM-WORKBENCH 项目阶段复盘 (v0)',
    scope: [{ targetType: 'project', targetId: 'pm-workbench' }],
    createdAt: now,
    createdByPersonId: 'person-001',
    outcome: {
      status: 'completed',
      highlights: ['Input events writeback reduces friction', 'Snapshot compare supports management review'],
      risks: ['External mapping incomplete for some projects'],
      actions: ['Add binding UI and mapping health checks']
    },
    evidence: [{ kind: 'link', refId: '/closeout', label: 'Closeout pack' }],
    notes: '复盘记录与决策日志可回挂到项目详情与管理驾驶舱。'
  }
];

export const seededDecisions: DecisionLogRecord[] = [
  {
    id: 'dec-001',
    title: '冻结核心指标口径 v1',
    decision: '所有关键指标必须通过 metric dictionary contract 暴露，并在页面消费 versioned contract。',
    reason: '避免便宜模型扩展导致指标口径漂移，影响管理信任。',
    scope: { targets: [{ targetType: 'project', targetId: 'pm-workbench' }] },
    decidedAt: now,
    decidedByPersonId: 'person-001',
    status: 'effective',
    followups: [
      { id: 'act-001', title: 'Add metric dictionary API', ownerPersonId: 'person-001', dueDate: '2026-04-01', status: 'done', notes: '' }
    ],
    relatedReviewId: 'rev-001'
  }
];

export const seededLessons: LessonLearnedRecord[] = [
  {
    id: 'les-001',
    title: '不要在页面内重算指标',
    lesson: '页面只消费 builder/service 输出结果，所有指标口径进入 metric contract 统一治理。',
    tags: ['governance', 'metrics', 'guardrail'],
    scope: { targets: [{ targetType: 'project', targetId: 'pm-workbench' }] },
    createdAt: now,
    createdByPersonId: 'person-001',
    relatedReviewId: 'rev-001'
  }
];

