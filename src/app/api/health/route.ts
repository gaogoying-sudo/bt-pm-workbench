import { NextRequest } from 'next/server';
import { success, toJsonResponse } from '@/server/contracts/response';
import { getRuntimeConfig } from '@/server/config/runtime-config';
import { inputEventRepository } from '@/server/repositories/input-event-repository';
import { snapshotBatchStore } from '@/server/persistence/snapshot-batch-store';

export async function GET(_request: NextRequest) {
  const cfg = getRuntimeConfig();
  const counts = {
    inputDrafts: inputEventRepository.listDrafts().length,
    confirmedEvents: inputEventRepository.listConfirmed().length,
    writebacks: inputEventRepository.listWritebacks().length,
    snapshotBatches: snapshotBatchStore.list().length
  };

  return toJsonResponse(
    success(
      {
        ok: true,
        runtime: cfg,
        counts
      },
      { source: 'health' }
    )
  );
}

