import { formatBilingualLabel, makeBilingualLabel } from '@/lib/view-config/bilingual-label-builders';

export const commonFieldLabels = {
  project: makeBilingualLabel('项目', 'Project'),
  stage: makeBilingualLabel('阶段', 'Stage'),
  owner: makeBilingualLabel('负责人', 'Owner'),
  status: makeBilingualLabel('状态', 'Status'),
  progress: makeBilingualLabel('进度', 'Progress'),
  risk: makeBilingualLabel('风险', 'Risk'),
  summary: makeBilingualLabel('摘要', 'Summary'),
  version: makeBilingualLabel('版本', 'Version'),
  writeback: makeBilingualLabel('回写', 'Write-back')
};

export function fieldLabel(key: keyof typeof commonFieldLabels) {
  return formatBilingualLabel(commonFieldLabels[key]);
}
