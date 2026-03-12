import { VersionRecord } from '@/lib/types/domain';

export const versions: VersionRecord[] = [
  { id: 'V-001', projectId: 'pm-workbench', objectType: 'system', objectName: 'PM Workbench', version: 'v0.1.0', status: 'active', isActive: true, previousVersion: 'v0.0.9', summary: '首版工程骨架上线', updatedAt: '2026-03-12' },
  { id: 'V-002', projectId: 'pm-workbench', objectType: 'docs', objectName: 'Governance Set', version: 'v0.1.0-docs', status: 'active', isActive: true, previousVersion: null, summary: '治理文档首版', updatedAt: '2026-03-12' },
  { id: 'V-003', projectId: 'pm-workbench', objectType: 'ui', objectName: 'Shell Layout', version: 'v0.1.1-rc', status: 'pending-confirmation', isActive: false, previousVersion: 'v0.1.0', summary: '布局细节待确认', updatedAt: '2026-03-12' },
  { id: 'V-004', projectId: 'ops-console', objectType: 'module', objectName: 'Alert Center', version: 'v1.3.0', status: 'active', isActive: true, previousVersion: 'v1.2.4', summary: '告警聚合升级', updatedAt: '2026-03-10' },
  { id: 'V-005', projectId: 'client-portal', objectType: 'module', objectName: 'Delivery View', version: 'v2.0.4', status: 'active', isActive: true, previousVersion: 'v2.0.3', summary: '修复状态同步问题', updatedAt: '2026-03-08' },
  { id: 'V-006', projectId: 'data-migration', objectType: 'workflow', objectName: 'Migration Audit', version: 'v3.2.1', status: 'archived', isActive: false, previousVersion: 'v3.2.0', summary: '封板后归档', updatedAt: '2026-02-26' },
  { id: 'V-007', projectId: 'pm-workbench', objectType: 'api-contract', objectName: 'Data Adapter', version: 'v0.2.0-draft', status: 'draft', isActive: false, previousVersion: 'v0.1.0', summary: '预留真实数据接入契约', updatedAt: '2026-03-12' },
  { id: 'V-008', projectId: 'archive-cleanup', objectType: 'report', objectName: 'Final Report', version: 'v1.0.0', status: 'archived', isActive: false, previousVersion: null, summary: '项目收官报告', updatedAt: '2025-12-20' }
];
