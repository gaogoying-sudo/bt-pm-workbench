import { BilingualLabel, makeBilingualLabel } from '@/lib/view-config/bilingual-label-builders';

export const taskStatusLabels: Record<string, BilingualLabel> = {
  'not-started': makeBilingualLabel('未开始', 'Not Started'),
  ready: makeBilingualLabel('就绪', 'Ready'),
  'in-progress': makeBilingualLabel('进行中', 'In Progress'),
  blocked: makeBilingualLabel('阻塞', 'Blocked'),
  'at-risk': makeBilingualLabel('有风险', 'At Risk'),
  done: makeBilingualLabel('已完成', 'Done'),
  paused: makeBilingualLabel('暂停', 'Paused'),
  cancelled: makeBilingualLabel('已取消', 'Cancelled')
};

export const projectProgressStatusLabels: Record<string, BilingualLabel> = {
  'not-started': makeBilingualLabel('未启动', 'Not Started'),
  'in-progress': makeBilingualLabel('推进中', 'In Progress'),
  'at-risk': makeBilingualLabel('有风险', 'At Risk'),
  blocked: makeBilingualLabel('阻塞', 'Blocked'),
  done: makeBilingualLabel('已完成', 'Done')
};

export const resourcePressureLabels: Record<string, BilingualLabel> = {
  low: makeBilingualLabel('低', 'Low'),
  medium: makeBilingualLabel('中', 'Medium'),
  high: makeBilingualLabel('高', 'High')
};

export const availabilityLabels: Record<string, BilingualLabel> = {
  available: makeBilingualLabel('可投入', 'Available'),
  'partially-available': makeBilingualLabel('部分可投入', 'Partially Available'),
  'fully-allocated': makeBilingualLabel('已满载', 'Fully Allocated'),
  unavailable: makeBilingualLabel('不可投入', 'Unavailable')
};

export const personStatusLabels: Record<string, BilingualLabel> = {
  active: makeBilingualLabel('在岗', 'Active'),
  'on-leave': makeBilingualLabel('休假中', 'On Leave'),
  unavailable: makeBilingualLabel('不可用', 'Unavailable'),
  candidate: makeBilingualLabel('候选中', 'Candidate'),
  pipeline: makeBilingualLabel('储备中', 'Pipeline'),
  archived: makeBilingualLabel('已归档', 'Archived')
};

export const releaseStatusLabels: Record<string, BilingualLabel> = {
  ready: makeBilingualLabel('可发布', 'Ready'),
  watching: makeBilingualLabel('观察中', 'Watching'),
  blocked: makeBilingualLabel('受阻', 'Blocked'),
  pending: makeBilingualLabel('待补齐', 'Pending')
};

export const signalSeverityLabels: Record<string, BilingualLabel> = {
  low: makeBilingualLabel('低', 'Low'),
  medium: makeBilingualLabel('中', 'Medium'),
  high: makeBilingualLabel('高', 'High')
};
