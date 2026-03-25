import { NextRequest } from 'next/server';
import { taskService } from '@/server/services/task-service';
import { buildManpowerActualInputAdapterResults } from '@/lib/manpower/actual-input-adapters';
import { buildAllocationWritebackPreviews } from '@/lib/resources/allocation-writeback-mappers';
import { success, toJsonResponse } from '@/server/contracts/response';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const snapshotDate = searchParams.get('snapshotDate') ?? undefined;

  const writebackRecords = taskService.getWritebackRecords(snapshotDate);
  const allocationPreviews = buildAllocationWritebackPreviews();
  const manpowerAdapterResults = buildManpowerActualInputAdapterResults();

  return toJsonResponse(success({
    writebackRecords,
    allocationPreviews,
    manpowerAdapterResults
  }, { source: 'writeback-chain' }));
}
