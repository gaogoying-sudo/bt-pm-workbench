import { TeamRecord } from '@/lib/types/identity';

export const teams: TeamRecord[] = [
  { id: 'team-workbench', name: 'PM-WORKBENCH Squad', orgUnitId: 'org-delivery', leadPersonId: 'person-alice', notes: 'Core workbench delivery team.' },
  { id: 'team-ops', name: 'Ops Console Squad', orgUnitId: 'org-platform', leadPersonId: 'person-ben', notes: 'Ops console and platform governance.' },
  { id: 'team-product', name: 'Product Core', orgUnitId: 'org-product', leadPersonId: 'person-dylan', notes: 'Roadmap & acceptance owners.' },
  { id: 'team-quality', name: 'Quality Enablement', orgUnitId: 'org-quality', leadPersonId: 'person-cora', notes: 'Release & regression governance.' },
  { id: 'team-ai-lab', name: 'AI Lab', orgUnitId: 'org-ai', leadPersonId: 'person-felix', notes: 'AI pilots and evaluation.' }
];

