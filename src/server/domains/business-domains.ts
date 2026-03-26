/**
 * Pack 2 — nine business domains as code anchors: read vs write boundaries point at
 * repositories / services / read-model-service (not page-local maps).
 */
import { personRepository } from '@/server/repositories/person-repository';
import { projectRepository } from '@/server/repositories/project-repository';
import { taskRepository } from '@/server/repositories/task-repository';
import { inputEventRepository } from '@/server/repositories/input-event-repository';
import { snapshotRepository } from '@/server/repositories/snapshot-repository';
import { dataExchangeRepository } from '@/server/repositories/data-exchange-repository';
import { qualityService } from '@/server/services/quality-service';
import { reviewService } from '@/server/services/review-service';
import { projectService } from '@/server/services/project-service';
import { readModelService } from '@/server/read-models/read-model-service';

export const identityAndOrganizationDomain = {
  label: '身份与组织域',
  read: () => ({ people: personRepository.findAllPersons(), note: 'read via personRepository' }),
  writes: { anchor: 'personRepository / identity registry (future SSO sync)' },
  readModels: { primary: 'resource_manpower_snapshot (people slice)' }
};

export const projectMasterDataDomain = {
  label: '项目主数据域',
  read: () => projectRepository.findAllBaseProjects(),
  writes: { anchor: 'projectRepository + unified-project-registry' },
  readModels: { primary: 'project_list_snapshot', detail: 'project_detail_snapshot' },
  services: { projectService }
};

export const taskExecutionDomain = {
  label: '任务执行域',
  read: () => taskRepository.findAllTasks(),
  writes: { anchor: 'task writeback + task-repository' },
  readModels: { primary: 'project_execution_snapshot' }
};

export const inputEventDomain = {
  label: '输入事件域',
  read: () => ({
    raw: inputEventRepository.listRaw(),
    drafts: inputEventRepository.listDrafts(),
    confirmed: inputEventRepository.listConfirmed()
  }),
  writes: { anchor: 'inputEventRepository (raw → draft → confirm → writeback)' },
  readModels: { primary: 'input_inbox_snapshot' }
};

export const resourceAndManpowerDomain = {
  label: '资源与人力投入域',
  read: () => ({ note: 'manpower + allocation data via builders in read models' }),
  writes: { anchor: 'manpower routes + allocations' },
  readModels: { primary: 'resource_manpower_snapshot' }
};

export const riskAndQualityDomain = {
  label: '风险与质量域',
  read: () => qualityService,
  writes: { anchor: 'quality-service + quality API' },
  readModels: { primary: 'embedded in project_progress_snapshot + governance' }
};

export const snapshotAndGovernanceDomain = {
  label: '快照与治理域',
  read: () => snapshotRepository,
  writes: { anchor: 'snapshot batches + data-governance API' },
  readModels: { primary: 'project_progress_snapshot', version: 'version_governance_snapshot' }
};

export const reviewAndDecisionDomain = {
  label: '复盘与决策域',
  read: () => reviewService,
  writes: { anchor: 'review-service + /api/reviews' },
  readModels: { primary: 'review pack via reviewService.listPack' }
};

export const externalCollaborationDomain = {
  label: '外部协同域',
  read: () => dataExchangeRepository.listBindings(),
  writes: { anchor: 'data-exchange-repository + import/export APIs' },
  readModels: { primary: 'readiness_summary_snapshot', exchange: 'external bindings' }
};

export const businessDomains = {
  identityAndOrganization: identityAndOrganizationDomain,
  projectMasterData: projectMasterDataDomain,
  taskExecution: taskExecutionDomain,
  inputEvents: inputEventDomain,
  resourceAndManpower: resourceAndManpowerDomain,
  riskAndQuality: riskAndQualityDomain,
  snapshotAndGovernance: snapshotAndGovernanceDomain,
  reviewAndDecision: reviewAndDecisionDomain,
  externalCollaboration: externalCollaborationDomain,
  readModelFacade: readModelService
} as const;
