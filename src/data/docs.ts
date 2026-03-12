import { DocumentRecord } from '@/lib/types/domain';

export const documentRecords: DocumentRecord[] = [
  { id: 'D-001', projectId: 'pm-workbench', title: 'PM-WORKBENCH 总索引', docType: 'master-index', status: 'active', isActive: true, readOrder: 1, description: '全局入口文档', updatedAt: '2026-03-12' },
  { id: 'D-002', projectId: 'pm-workbench', title: '项目定义', docType: 'control-document', status: 'active', isActive: true, readOrder: 2, description: '说明项目定位与边界', updatedAt: '2026-03-12' },
  { id: 'D-003', projectId: 'pm-workbench', title: '版本归属表', docType: 'version-matrix', status: 'active', isActive: true, readOrder: 3, description: '维护版本链归属', updatedAt: '2026-03-12' },
  { id: 'D-004', projectId: 'pm-workbench', title: '需求变更记录', docType: 'change-log', status: 'active', isActive: true, readOrder: 4, description: '记录需求变化', updatedAt: '2026-03-12' },
  { id: 'D-005', projectId: 'pm-workbench', title: '候选引用清单', docType: 'references-list', status: 'reviewing', isActive: false, readOrder: 5, description: '待审核引用对象', updatedAt: '2026-03-11' },
  { id: 'D-006', projectId: 'pm-workbench', title: '页面信息架构', docType: 'information-architecture', status: 'active', isActive: true, readOrder: 6, description: '模块职责和页面层级', updatedAt: '2026-03-12' },
  { id: 'D-007', projectId: 'ops-console', title: '告警中心专题', docType: 'topic-document', status: 'reviewing', isActive: false, readOrder: 2, description: '告警聚合改版方案', updatedAt: '2026-03-10' },
  { id: 'D-008', projectId: 'client-portal', title: '门户主控文档', docType: 'control-document', status: 'active', isActive: true, readOrder: 1, description: '客户门户主控入口', updatedAt: '2026-03-08' },
  { id: 'D-009', projectId: 'data-migration', title: '迁移历史归档', docType: 'archive', status: 'archived', isActive: false, readOrder: 9, description: '封板后历史记录', updatedAt: '2026-02-26' },
  { id: 'D-010', projectId: 'archive-cleanup', title: '归档治理总结', docType: 'archive', status: 'archived', isActive: false, readOrder: 10, description: '行动总结报告', updatedAt: '2025-12-20' }
];
