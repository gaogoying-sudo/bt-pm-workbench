import { NextRequest } from 'next/server';
import { snapshotService } from '@/server/services/snapshot-service';
import { success, failure, toJsonResponse } from '@/server/contracts/response';
import { snapshotBatchStore } from '@/server/persistence/snapshot-batch-store';
import { SnapshotBatchRecord } from '@/lib/types/timeline-snapshot';

export async function GET(_request: NextRequest) {
  const batches = snapshotBatchStore.list();
  return toJsonResponse(success(batches, { total: batches.length, source: 'snapshot-batch-store' }));
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as null | {
    snapshotDate?: string;
    baselineDate?: string;
    compareDate?: string;
    notes?: string;
  };

  if (!body) return toJsonResponse(failure('Invalid JSON body'), 400);

  const context = snapshotService.resolveSnapshotContext({
    snapshotDate: body.snapshotDate,
    baselineDate: body.baselineDate,
    compareDate: body.compareDate
  });

  const now = new Date().toISOString();
  const id = `sb-${now.replace(/[:.]/g, '-')}`;

  const record: SnapshotBatchRecord = {
    id,
    createdAt: now,
    context,
    points: [
      { pointType: 'baseline', date: context.baselineDate ?? context.snapshotDate, label: 'Baseline' },
      { pointType: 'current', date: context.snapshotDate, label: 'Current' },
      ...(context.compareDate ? [{ pointType: 'compare' as const, date: context.compareDate, label: 'Compare' }] : [])
    ],
    notes: body.notes
  };

  snapshotBatchStore.create(record);
  return toJsonResponse(success(record, { source: 'snapshot-batch-store' }), 201);
}

