import { SensitiveCostProfile } from '@/lib/types/people-resources';

export const sensitiveCostProfiles: SensitiveCostProfile[] = [
  { id: 'scp-001', personId: 'person-alice', salaryBand: 'Band-C3', costCenter: 'Delivery-UI', monthlyBaseCost: 36500, variableCostRatio: 0.12, currency: 'CNY', visibilityScope: 'masked', isMocked: true, notes: 'Masked placeholder only. Real values should come from a restricted service.' },
  { id: 'scp-002', personId: 'person-ben', salaryBand: 'Band-D1', costCenter: 'Platform-Core', monthlyBaseCost: 44800, variableCostRatio: 0.15, currency: 'CNY', visibilityScope: 'finance-only', isMocked: true, notes: 'Finance-only mock profile for cost planning integration.' },
  { id: 'scp-003', personId: 'person-dylan', salaryBand: 'Band-C4', costCenter: 'Product-Planning', monthlyBaseCost: 41800, variableCostRatio: 0.1, currency: 'CNY', visibilityScope: 'restricted', isMocked: true, notes: 'Restricted placeholder tied to project planning only.' },
  { id: 'scp-004', personId: 'person-felix', salaryBand: 'Band-D2', costCenter: 'AI-Lab', monthlyBaseCost: 61800, variableCostRatio: 0.18, currency: 'CNY', visibilityScope: 'admin-only', isMocked: true, notes: 'Admin-only placeholder due scarce role sensitivity.' }
];
