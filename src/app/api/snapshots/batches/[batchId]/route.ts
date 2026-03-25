import { NextRequest } from 'next/server';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { snapshotBatchStore } from '@/server/persistence/snapshot-batch-store';

export async function GET(_request: NextRequest, { params }: { params: { batchId: string } }) {
  const batch = snapshotBatchStore.get(params.batchId);
  if (!batch) return toJsonResponse(failure('Snapshot batch not found'), 404);
  return toJsonResponse(success(batch, { source: 'snapshot-batch-store' }));
}

