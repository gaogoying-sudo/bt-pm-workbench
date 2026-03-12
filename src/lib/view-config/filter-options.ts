import { formatBilingualLabel } from '@/lib/view-config/bilingual-label-builders';
import {
  availabilityLabels,
  personStatusLabels,
  projectProgressStatusLabels,
  resourcePressureLabels,
  taskStatusLabels
} from '@/lib/view-config/status-labels';

export function buildStatusOptions(source: Record<string, { zh: string; en: string }>, includeAll = true) {
  const items = Object.entries(source).map(([value, label]) => ({
    value,
    label: formatBilingualLabel(label)
  }));

  return includeAll ? [{ value: 'all', label: '全部 / All' }, ...items] : items;
}

export const taskStatusOptions = buildStatusOptions(taskStatusLabels);
export const progressStatusOptions = buildStatusOptions(projectProgressStatusLabels);
export const resourcePressureOptions = buildStatusOptions(resourcePressureLabels);
export const peopleStatusOptions = buildStatusOptions(personStatusLabels);
export const availabilityOptions = buildStatusOptions(availabilityLabels);

export const commonViewModes = {
  task: ['项目视图 / Project View', '人员视图 / Person View', '阶段视图 / Stage View', '状态视图 / Status View'],
  progress: ['项目视图 / Project View', '阶段视图 / Stage View', '风险视图 / Risk View'],
  governance: ['版本视图 / Version View', '项目视图 / Project View', '风险视图 / Risk View'],
  resource: ['人员视图 / People View', '角色视图 / Role View', '资源池视图 / Resource Pool View', '招聘缺口视图 / Hiring Gap View']
} as const;
