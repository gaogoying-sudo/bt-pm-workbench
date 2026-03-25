import { resolveProjectId, getAllProjectIdentities } from '@/lib/identity/unified-project-registry';
import { InputResolutionRecord, ParsedInputIntent, EventTargetRef } from '@/lib/types/input-events';
import { taskRepository } from '@/server/repositories/task-repository';

function findProjectIdByText(rawText: string): string | null {
  const t = rawText.toLowerCase();
  const identities = getAllProjectIdentities();
  const hit = identities.find((p) => t.includes(p.code.toLowerCase()) || t.includes(p.displayName.toLowerCase()));
  if (hit) return hit.canonicalId;
  return null;
}

function findTaskIdByText(rawText: string): string | null {
  const m = rawText.match(/task[-_]?([a-z0-9-]+)/i);
  if (m?.[0]) {
    const exact = taskRepository.findAllTasks().find((t) => t.id.toLowerCase() === m[0].toLowerCase());
    if (exact) return exact.id;
  }
  return null;
}

export const inputResolverService = {
  resolve(rawText: string, intent: ParsedInputIntent): InputResolutionRecord {
    const projectId = findProjectIdByText(rawText);
    const canonicalProjectId = projectId ? resolveProjectId(projectId) : null;
    const taskId = intent.eventType === 'task-activity' ? findTaskIdByText(rawText) : null;

    const targets: EventTargetRef[] = [];
    if (canonicalProjectId) targets.push({ targetType: 'project', targetId: canonicalProjectId, canonicalProjectId });
    if (taskId) targets.push({ targetType: 'task-execution', targetId: taskId, canonicalProjectId: canonicalProjectId ?? undefined });

    return {
      resolvedProjectId: canonicalProjectId,
      resolvedStageId: null,
      resolvedTaskId: taskId,
      resolvedPersonId: null,
      resolvedRoleId: null,
      targets,
      unresolvedHints: canonicalProjectId ? [] : ['projectId']
    };
  }
};

