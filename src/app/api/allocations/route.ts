import { NextRequest } from 'next/server';
import { personRepository } from '@/server/repositories/person-repository';
import { taskService } from '@/server/services/task-service';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId') ?? undefined;
  const snapshotDate = searchParams.get('snapshotDate') ?? undefined;

  const allocations = projectId
    ? personRepository.findAllocationsByProjectId(projectId)
    : personRepository.findAllAllocations();
  const consumption = taskService.getAllocationConsumption(snapshotDate);

  return toJsonResponse(success({
    allocations,
    consumption
  }, { total: allocations.length, source: 'person-repository + task-service' }));
}
