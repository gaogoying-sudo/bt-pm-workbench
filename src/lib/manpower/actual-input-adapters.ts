import { manpowerActualInputs } from '@/data/manpower/manpower-actual-inputs';
import { buildAllocationWritebackPreviews } from '@/lib/resources/allocation-writeback-mappers';
import { buildTaskExecutionWritebackRecords } from '@/lib/task-execution/writeback-mappers';
import { ManpowerActualInputAdapterResult } from '@/lib/types/manpower-calculation';

export function buildManpowerActualInputAdapterResults(): ManpowerActualInputAdapterResult[] {
  const taskWritebacks = buildTaskExecutionWritebackRecords();
  const allocationWritebacks = buildAllocationWritebackPreviews();

  return taskWritebacks.map((record) => {
    const existingActual = manpowerActualInputs.find(
      (input) => input.projectId === record.sourceProjectId && input.stageId === record.sourceStageId
    );
    const relatedAllocationWritebacks = allocationWritebacks.filter(
      (preview) => preview.projectId === record.sourceProjectId && record.targetAllocationIds.includes(preview.id.replace('alloc-writeback-', ''))
    );

    return {
      projectId: record.sourceProjectId,
      stageId: record.sourceStageId,
      sourceTaskCount: record.sourceTaskIds.length,
      sourceAllocationCount: record.targetAllocationIds.length,
      adaptedActualWorkDays: Math.max(
        record.aggregatedActualWorkDays,
        existingActual?.actualPersonDays ?? 0,
        relatedAllocationWritebacks.reduce((sum, preview) => sum + preview.actualWorkDays, 0)
      ),
      adaptedActualCost: Math.max(
        record.estimatedActualCost,
        existingActual?.actualCost ?? 0,
        relatedAllocationWritebacks.reduce((sum, preview) => sum + preview.estimatedActualCost, 0)
      ),
      notes:
        'v0 口径：任务回写实际工天与 allocation 回写预览共同进入 manpower actual input adapter，取较大值保留保守估算 / v0 rule uses the larger value between task write-back and allocation preview.'
    };
  });
}
