import { ActualInputRecord } from '@/lib/types/manpower';

export const manpowerActualInputs: ActualInputRecord[] = [
  {
    id: 'actual-pmw-project',
    projectId: 'project-pm-workbench',
    versionId: 'version-pmw-r2',
    actualPersonDays: 201,
    actualCost: 414600,
    sourceType: 'manual-json',
    recordedAt: '2026-03-12',
    note: '模拟导入当前滚动实际数据。'
  },
  {
    id: 'actual-ops-project',
    projectId: 'project-ops-console',
    versionId: 'version-ops-r3',
    actualPersonDays: 246,
    actualCost: 560100,
    sourceType: 'manual-json',
    recordedAt: '2026-03-12',
    note: '联调压力导致测试和平台投入超预期。'
  },
  {
    id: 'actual-copilot-project',
    projectId: 'project-ai-copilot',
    versionId: 'version-copilot-r1',
    actualPersonDays: 228,
    actualCost: 607400,
    sourceType: 'formula-import',
    recordedAt: '2026-03-12',
    note: '基于试点情景测算生成的模拟实际。'
  },
  {
    id: 'actual-data-project',
    projectId: 'project-data-hub',
    versionId: 'version-data-r2',
    actualPersonDays: 166,
    actualCost: 409000,
    sourceType: 'manual-json',
    recordedAt: '2026-03-12',
    note: '暂停状态下的保守执行实际。'
  },
  {
    id: 'actual-pmw-stage-dev',
    projectId: 'project-pm-workbench',
    versionId: 'version-pmw-r2',
    stageId: 'stage-pmw-3',
    actualPersonDays: 80,
    actualCost: 171600,
    sourceType: 'timesheet-sync',
    recordedAt: '2026-03-12',
    note: '开发阶段接近实时同步口径。'
  },
  {
    id: 'actual-pmw-stage-test',
    projectId: 'project-pm-workbench',
    versionId: 'version-pmw-r2',
    stageId: 'stage-pmw-4',
    actualPersonDays: 32,
    actualCost: 63200,
    sourceType: 'timesheet-sync',
    recordedAt: '2026-03-12',
    note: '联调阶段目前低于计划。'
  },
  {
    id: 'actual-ops-stage-test',
    projectId: 'project-ops-console',
    versionId: 'version-ops-r3',
    stageId: 'stage-ops-4',
    actualPersonDays: 61,
    actualCost: 138000,
    sourceType: 'manual-json',
    recordedAt: '2026-03-12',
    note: '高风险阶段已发生明显超支。'
  },
  {
    id: 'actual-copilot-stage-dev',
    projectId: 'project-ai-copilot',
    versionId: 'version-copilot-r1',
    stageId: 'stage-copilot-3',
    actualPersonDays: 108,
    actualCost: 287300,
    sourceType: 'formula-import',
    recordedAt: '2026-03-12',
    note: '模型实验轮次增加带来开发成本抬升。'
  },
  {
    id: 'actual-data-stage-dev',
    projectId: 'project-data-hub',
    versionId: 'version-data-r2',
    stageId: 'stage-data-3',
    actualPersonDays: 64,
    actualCost: 157800,
    sourceType: 'manual-json',
    recordedAt: '2026-03-12',
    note: '项目缩减范围后开发投入低于原计划。'
  }
];
