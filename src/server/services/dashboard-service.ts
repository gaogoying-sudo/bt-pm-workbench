import { snapshotRepository } from '@/server/repositories/snapshot-repository';
import {
  buildExecutiveOverviewSnapshot,
  buildProjectHealthSnapshots,
  buildResourceHealthSnapshot,
  buildVersionHealthSnapshots,
  buildDeliveryRiskSnapshots
} from '@/lib/executive-dashboard/dashboard-builders';
import { qualityService } from '@/server/services/quality-service';
import { resolveProjectId } from '@/lib/identity/unified-project-registry';

export const dashboardService = {
  getOverview() {
    return buildExecutiveOverviewSnapshot();
  },

  getProjectHealth() {
    return buildProjectHealthSnapshots();
  },

  getResourceHealth() {
    return buildResourceHealthSnapshot();
  },

  getVersionHealth() {
    return buildVersionHealthSnapshots();
  },

  getDeliveryRisks() {
    return buildDeliveryRiskSnapshots();
  },

  getQualitySummary() {
    const checks = qualityService.listAllChecks();
    const passed = checks.filter((c) => c.status === 'passed').length;
    const failed = checks.filter((c) => c.status === 'failed').length;
    const pending = checks.filter((c) => c.status === 'pending' || c.status === 'in-review').length;
    return { total: checks.length, passed, failed, pending };
  }
};
