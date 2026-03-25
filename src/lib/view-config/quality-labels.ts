import { QualitySeverity, QualityStatus } from '@/lib/types/quality';

export const qualityStatusLabels: Record<QualityStatus, string> = {
  pending: '待开始 / Pending',
  'in-review': '评审中 / In review',
  passed: '通过 / Passed',
  failed: '失败 / Failed',
  waived: '豁免 / Waived'
};

export const qualitySeverityLabels: Record<QualitySeverity, string> = {
  info: '信息 / Info',
  minor: '轻微 / Minor',
  major: '主要 / Major',
  critical: '严重 / Critical'
};

