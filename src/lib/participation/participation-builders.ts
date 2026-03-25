import { peopleResources } from '@/data/resources/people-resources';
import { taskExecutionRecords } from '@/data/task-execution/task-execution-records';
import { projectAllocations } from '@/data/resources/project-allocations';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export interface ProjectParticipationRecord {
  id: string;
  projectId: string;
  personId: string;
  roleType: 'owner' | 'stage-owner' | 'assignee' | 'support' | 'observer';
  status: 'active' | 'inactive';
  notes?: string;
}

export function buildProjectParticipationRecords(): ProjectParticipationRecord[] {
  const records: ProjectParticipationRecord[] = [];

  for (const alloc of projectAllocations) {
    records.push({
      id: `pp-${alloc.projectId}-${alloc.personId}`,
      projectId: resolveProjectId(alloc.projectId),
      personId: alloc.personId,
      roleType: 'support',
      status: 'active',
      notes: 'Derived from staffing allocation.'
    });
  }

  for (const task of taskExecutionRecords) {
    records.push({
      id: `pp-task-${task.projectId}-${task.ownerPersonId}`,
      projectId: resolveProjectId(task.projectId),
      personId: task.ownerPersonId,
      roleType: 'assignee',
      status: 'active',
      notes: `Derived from task owner: ${task.id}`
    });
  }

  // lightweight owner inference: PM role in project currentProjectIds
  const pmCandidates = peopleResources.filter((p) => p.primaryRoleId.includes('pm') || p.primaryRoleId.includes('product'));
  for (const p of pmCandidates) {
    for (const pid of p.currentProjectIds) {
      records.push({
        id: `pp-owner-${pid}-${p.id}`,
        projectId: resolveProjectId(pid),
        personId: p.id,
        roleType: 'owner',
        status: 'active',
        notes: 'Derived from PM role + currentProjectIds.'
      });
    }
  }

  // dedupe by (projectId, personId, roleType)
  const key = (r: ProjectParticipationRecord) => `${r.projectId}::${r.personId}::${r.roleType}`;
  const map = new Map<string, ProjectParticipationRecord>();
  for (const r of records) map.set(key(r), r);
  return [...map.values()];
}

export function buildParticipationScope(userId: string): { mode: 'all' | 'participating-only' | 'readonly-observer'; projectIds: string[] } {
  const participations = buildProjectParticipationRecords().filter((p) => p.personId === userId && p.status === 'active');
  const projectIds = [...new Set(participations.map((p) => p.projectId))];

  // exec sees all; observer sees readonly; others participating-only
  if (userId === 'person-exec') return { mode: 'all', projectIds: [] };
  return { mode: 'participating-only', projectIds };
}

