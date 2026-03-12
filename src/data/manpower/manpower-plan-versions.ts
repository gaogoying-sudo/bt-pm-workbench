import { PlanVersion } from '@/lib/types/manpower';

export const manpowerPlanVersions: PlanVersion[] = [
  {
    id: 'version-pmw-b1',
    projectId: 'project-pm-workbench',
    name: 'Baseline v1',
    isBaseline: true,
    createdAt: '2026-03-01',
    description: '项目立项后首次形成的基准计划版本。',
    sourceType: 'manual',
    status: 'baseline'
  },
  {
    id: 'version-pmw-r2',
    projectId: 'project-pm-workbench',
    name: 'Rolling v2',
    isBaseline: false,
    createdAt: '2026-03-09',
    description: '根据需求拆分与模块优先级调整后的滚动版本。',
    sourceType: 'adjusted',
    status: 'active'
  },
  {
    id: 'version-ops-b1',
    projectId: 'project-ops-console',
    name: 'Baseline v1',
    isBaseline: true,
    createdAt: '2026-02-15',
    description: '运维控制台升级的基准排期和角色配置。',
    sourceType: 'manual',
    status: 'baseline'
  },
  {
    id: 'version-ops-r3',
    projectId: 'project-ops-console',
    name: 'Recovery v3',
    isBaseline: false,
    createdAt: '2026-03-05',
    description: '联调期后重新压缩发布路径的调整版本。',
    sourceType: 'adjusted',
    status: 'active'
  },
  {
    id: 'version-copilot-b1',
    projectId: 'project-ai-copilot',
    name: 'Baseline v1',
    isBaseline: true,
    createdAt: '2026-03-10',
    description: '试点项目首次规划版本。',
    sourceType: 'manual',
    status: 'baseline'
  },
  {
    id: 'version-copilot-r1',
    projectId: 'project-ai-copilot',
    name: 'Scenario v1',
    isBaseline: false,
    createdAt: '2026-03-12',
    description: '预留 JSON 导入后可快速刷新测算的场景版本。',
    sourceType: 'imported',
    status: 'active'
  },
  {
    id: 'version-data-b1',
    projectId: 'project-data-hub',
    name: 'Baseline v1',
    isBaseline: true,
    createdAt: '2026-01-20',
    description: '数据治理项目初版基线。',
    sourceType: 'manual',
    status: 'baseline'
  },
  {
    id: 'version-data-r2',
    projectId: 'project-data-hub',
    name: 'Hold v2',
    isBaseline: false,
    createdAt: '2026-02-28',
    description: '等待上游接口稳定后的保守版资源安排。',
    sourceType: 'adjusted',
    status: 'active'
  }
];
