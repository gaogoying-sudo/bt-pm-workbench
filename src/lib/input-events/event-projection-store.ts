import { EventActorRecord, InputEventType } from '@/lib/types/input-events';

export interface ProjectRiskEventProjection {
  id: string;
  projectId: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  summary: string;
  createdAt: string;
  createdBy: EventActorRecord;
  sourceEventId: string;
  eventType: InputEventType;
}

const projectRiskEvents: ProjectRiskEventProjection[] = [];

export function addProjectRiskEvent(event: ProjectRiskEventProjection) {
  projectRiskEvents.unshift(event);
}

export function listProjectRiskEvents(projectId?: string) {
  return projectId ? projectRiskEvents.filter((e) => e.projectId === projectId) : projectRiskEvents;
}

