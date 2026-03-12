import { ManpowerProject } from '@/lib/types/manpower';

export const manpowerProjects: ManpowerProject[] = [
  {
    id: 'project-pm-workbench',
    name: 'PM Workbench 增强版',
    code: 'PMW-2026',
    status: 'active',
    priority: 'P0',
    owner: 'Wendy',
    startDate: '2026-03-01',
    endDate: '2026-05-30',
    currentPlanVersionId: 'version-pmw-r2',
    notes: '聚焦项目治理、版本矩阵和多项目分析能力。'
  },
  {
    id: 'project-ops-console',
    name: 'Ops Console 升级',
    code: 'OPS-REVAMP',
    status: 'at-risk',
    priority: 'P1',
    owner: 'Aaron',
    startDate: '2026-02-15',
    endDate: '2026-06-15',
    currentPlanVersionId: 'version-ops-r3',
    notes: '联调测试与发布窗口紧张，当前处于高关注状态。'
  },
  {
    id: 'project-ai-copilot',
    name: '交付 Copilot 试点',
    code: 'COPILOT-PILOT',
    status: 'planning',
    priority: 'P1',
    owner: 'Mia',
    startDate: '2026-03-10',
    endDate: '2026-07-10',
    currentPlanVersionId: 'version-copilot-r1',
    notes: '以多角色协作为核心，强调算法与产品协同。'
  },
  {
    id: 'project-data-hub',
    name: '交付数据中台治理',
    code: 'DATA-HUB',
    status: 'on-hold',
    priority: 'P2',
    owner: 'Leo',
    startDate: '2026-01-20',
    endDate: '2026-06-20',
    currentPlanVersionId: 'version-data-r2',
    notes: '等待上游接口约束稳定，暂缓扩大投入。'
  }
];
