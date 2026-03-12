import { ProjectVersionLinkRecord } from '@/lib/types/project-progress';

export const projectVersionLinkRecords: ProjectVersionLinkRecord[] = [
  {
    id: 'pvl-pmw-current',
    projectId: 'project-pm-workbench',
    linkedVersionId: 'version-pmw-r2',
    versionName: 'Rolling v2',
    relationType: 'current-plan',
    progressSnapshotDate: '2026-03-12',
    baselineProgress: 0.42,
    currentProgress: 0.54,
    variance: 0.12,
    notes: '当前进度高于初始基准，适合作为工作台演进样例 / Current progress is ahead of the original baseline.'
  },
  {
    id: 'pvl-ops-release',
    projectId: 'project-ops-console',
    linkedVersionId: 'version-ops-r3',
    versionName: 'Recovery v3',
    relationType: 'release-target',
    progressSnapshotDate: '2026-03-12',
    baselineProgress: 0.6,
    currentProgress: 0.46,
    variance: -0.14,
    notes: '发布目标与当前执行出现偏差，需要阶段纠偏 / Release target is lagging behind current execution.'
  },
  {
    id: 'pvl-copilot-baseline',
    projectId: 'project-ai-copilot',
    linkedVersionId: 'version-copilot-b1',
    versionName: 'Baseline v1',
    relationType: 'baseline-reference',
    progressSnapshotDate: '2026-03-12',
    baselineProgress: 0.5,
    currentProgress: 0.56,
    variance: 0.06,
    notes: '试点执行略快于基线，但风险仍高 / Pilot execution is slightly ahead of baseline with elevated risk.'
  },
  {
    id: 'pvl-data-align',
    projectId: 'project-data-hub',
    linkedVersionId: 'version-data-r2',
    versionName: 'Hold v2',
    relationType: 'milestone-alignment',
    progressSnapshotDate: '2026-03-12',
    baselineProgress: 0.48,
    currentProgress: 0.3,
    variance: -0.18,
    notes: '与暂停状态对齐，当前只保留里程碑参考 / Paused project keeps milestone alignment only.'
  }
];
