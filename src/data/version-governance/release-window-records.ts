import { ReleaseWindowRecord } from '@/lib/types/version-governance';

export const releaseWindowRecords: ReleaseWindowRecord[] = [
  {
    id: 'window-pmw-r2',
    linkedVersionId: 'version-pmw-r2',
    windowName: '三月发布窗口 / March Release Window',
    plannedStartDate: '2026-03-22',
    plannedEndDate: '2026-03-26',
    releaseManager: 'Evelyn Zhou',
    status: 'locked',
    notes: '核心验证窗口已锁定，需重点关注联调与回写覆盖 / Validation window is locked; integration and write-back coverage remain key.'
  },
  {
    id: 'window-ops-r3',
    linkedVersionId: 'version-ops-r3',
    windowName: '四月运维治理窗口 / April Ops Window',
    plannedStartDate: '2026-04-08',
    plannedEndDate: '2026-04-12',
    releaseManager: 'Marcus Lin',
    status: 'planned',
    notes: '待补齐资源压力缓解方案后进入锁窗 / Lock after resource pressure mitigation is confirmed.'
  },
  {
    id: 'window-ai-r1',
    linkedVersionId: 'version-ai-r1',
    windowName: '算法服务首发窗口 / AI Service Launch Window',
    plannedStartDate: '2026-04-18',
    plannedEndDate: '2026-04-22',
    releaseManager: 'Nina Gao',
    status: 'tentative',
    notes: '依赖算法验证与数据质量门禁 / Depends on AI validation and data quality gates.'
  },
  {
    id: 'window-data-r1',
    linkedVersionId: 'version-dh-r1',
    windowName: '数据中台稳定性窗口 / Data Hub Stability Window',
    plannedStartDate: '2026-03-29',
    plannedEndDate: '2026-04-02',
    releaseManager: 'Iris Chen',
    status: 'planned',
    notes: '以资源补位和历史回写校验为前置条件 / Resource backfill and write-back verification remain prerequisites.'
  }
];
