import { ActionPlaybookRecord } from '@/lib/types/recommendations';

export const actionPlaybooks: ActionPlaybookRecord[] = [
  {
    id: 'pb-owner-participation',
    code: 'playbook.owner.participation.fix',
    name: '补齐责任人/参与关系',
    description: '确保项目/阶段/任务 owner 与参与关系清晰，避免治理无人负责。',
    defaultPriority: 'p1',
    suggestedActions: [
      {
        id: 'act-assign-owner',
        title: '补齐 owner / assignee',
        steps: ['在 identity/participation 中补齐项目 owner 与关键阶段 owner', '对任务执行补齐 ownerPersonId / collaboratorPersonIds'],
        expectedImpact: '提升责任闭环，降低“无人认领”风险',
        ownerSuggestion: { roleHint: 'project-manager' }
      }
    ]
  },
  {
    id: 'pb-quality-gate-tighten',
    code: 'playbook.quality.gate.tighten',
    name: '提前收口质量门禁',
    description: '当质量 readiness 下滑时，建议加密检查并提前锁门禁。',
    defaultPriority: 'p1',
    suggestedActions: [
      {
        id: 'act-add-checks',
        title: '补充质量检查与门禁说明',
        steps: ['在 quality-check records 中补齐关键 deliverable 检查', '对 failing/pending 项加 owner 与截止时间'],
        expectedImpact: '降低 release 前的质量不确定性',
        ownerSuggestion: { roleHint: 'qa' }
      }
    ]
  },
  {
    id: 'pb-backlog-cleanup',
    code: 'playbook.backlog.cleanup',
    name: '清理输入确认 backlog',
    description: '当 input drafts 堆积时，建议优先完成确认/拒绝并回写。',
    defaultPriority: 'p0',
    suggestedActions: [
      {
        id: 'act-triage-inbox',
        title: '在 Input Inbox 做批量确认/拒绝',
        steps: ['打开 /input-inbox', '优先处理 oldest drafts', '确认后检查项目页 recent events 是否更新'],
        expectedImpact: '恢复 writeback 主链，避免状态滞后',
        ownerSuggestion: { roleHint: 'project-owner' }
      }
    ]
  },
  {
    id: 'pb-external-mapping-fix',
    code: 'playbook.external.mapping.fix',
    name: '修正外部映射与 readiness 降级',
    description: '外部 readiness 阻塞时，优先补齐 external mapping。',
    defaultPriority: 'p2',
    suggestedActions: [
      {
        id: 'act-bind-external',
        title: '通过 Data Exchange import apply 绑定 externalProjectId',
        steps: ['打开 /data-exchange', 'Import Preview', '确认 Apply 写入 binding', '回到项目详情查看 readiness reasons'],
        expectedImpact: '恢复外部系统可消费的 readiness 摘要',
        ownerSuggestion: { roleHint: 'operations' }
      }
    ]
  }
];

