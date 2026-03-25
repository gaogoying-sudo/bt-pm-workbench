import { NextRequest } from 'next/server';
import { personRepository } from '@/server/repositories/person-repository';
import { taskService } from '@/server/services/task-service';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const snapshotDate = searchParams.get('snapshotDate') ?? undefined;

  const persons = personRepository.findAllPersons();
  const roles = personRepository.findAllRoles();
  const allocations = personRepository.findAllAllocations();
  const personLoads = taskService.getPersonLoads(snapshotDate);

  return toJsonResponse(success({
    persons,
    roles,
    allocations,
    personLoads
  }, { total: persons.length, source: 'person-repository + task-service' }));
}
