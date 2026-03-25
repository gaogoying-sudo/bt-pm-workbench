import { OrgUnitRecord } from '@/lib/types/identity';

export const orgUnits: OrgUnitRecord[] = [
  {
    id: 'org-bt',
    name: 'BT',
    parentOrgUnitId: null,
    pathLabel: 'BT',
    managerPersonId: null,
    displayOrder: 1
  },
  {
    id: 'org-delivery',
    name: 'Delivery Engineering',
    parentOrgUnitId: 'org-bt',
    pathLabel: 'BT / Delivery Engineering',
    managerPersonId: 'person-ben',
    displayOrder: 2
  },
  {
    id: 'org-platform',
    name: 'Platform Engineering',
    parentOrgUnitId: 'org-bt',
    pathLabel: 'BT / Platform Engineering',
    managerPersonId: 'person-ben',
    displayOrder: 3
  },
  {
    id: 'org-product',
    name: 'Product Management',
    parentOrgUnitId: 'org-bt',
    pathLabel: 'BT / Product Management',
    managerPersonId: 'person-dylan',
    displayOrder: 4
  },
  {
    id: 'org-quality',
    name: 'Quality Enablement',
    parentOrgUnitId: 'org-bt',
    pathLabel: 'BT / Quality Enablement',
    managerPersonId: 'person-cora',
    displayOrder: 5
  },
  {
    id: 'org-ai',
    name: 'AI Delivery Lab',
    parentOrgUnitId: 'org-bt',
    pathLabel: 'BT / AI Delivery Lab',
    managerPersonId: 'person-felix',
    displayOrder: 6
  }
];

