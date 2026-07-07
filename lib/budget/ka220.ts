// KA220 Cooperation Partnerships (2021-2027 Erasmus+ Programme Guide) sabit lump sum modeli.
// Detaylı harcama kalemi (seyahat, günlük bireysel destek vb.) istenmez; başvuru, seçilen lump sum'ın
// iş paketlerine ve iş paketlerinin kuruluşlara nasıl dağıtıldığını gösterir.
export const KA220_LUMP_SUM_OPTIONS = [120000, 250000, 400000] as const;
export type Ka220LumpSum = (typeof KA220_LUMP_SUM_OPTIONS)[number];

// Proje Yönetimi (WP1) iş paketi, toplam lump sum'ın en fazla %20'sini kapsayabilir.
export const KA220_PM_MAX_SHARE = 0.2;

export interface Ka220Organisation {
  id: string;
  role: "coordinator" | "partner";
  name: string;
  country: string;
  city: string;
  organisationType: string;
  isNewcomer: boolean;
}

export interface Ka220Activity {
  id: string;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  leadOrgId: string;
  participatingOrgIds: string[];
  amount: number;
  expectedResults: string;
}

export interface Ka220WorkPackage {
  id: string;
  title: string;
  isProjectManagement: boolean;
  budget: number;
  specificObjectives: string;
  mainResults: string;
  qualitativeIndicators: string;
  quantitativeIndicators: string;
  taskAllocation: string;
  budgetJustification: string;
  activities: Ka220Activity[];
  orgAllocations: Record<string, number>;
}

export function getWpActivitiesTotal(wp: Ka220WorkPackage): number {
  return wp.activities.reduce((sum, a) => sum + (a.amount || 0), 0);
}

export function getWpOrgAllocationTotal(wp: Ka220WorkPackage): number {
  return Object.values(wp.orgAllocations).reduce((sum, v) => sum + (v || 0), 0);
}

export function getTotalBudget(workPackages: Ka220WorkPackage[]): number {
  return workPackages.reduce((sum, wp) => sum + (wp.budget || 0), 0);
}

export function getProjectManagementShare(workPackages: Ka220WorkPackage[], lumpSum: number): number {
  if (!lumpSum) return 0;
  const pmBudget = workPackages.find((wp) => wp.isProjectManagement)?.budget ?? 0;
  return pmBudget / lumpSum;
}

export interface OrgTotals {
  orgId: string;
  perWp: Record<string, number>;
  total: number;
}

export function getOrganisationTotals(
  organisations: Ka220Organisation[],
  workPackages: Ka220WorkPackage[]
): OrgTotals[] {
  return organisations.map((org) => {
    const perWp: Record<string, number> = {};
    let total = 0;
    for (const wp of workPackages) {
      const amount = wp.orgAllocations[org.id] || 0;
      perWp[wp.id] = amount;
      total += amount;
    }
    return { orgId: org.id, perWp, total };
  });
}

export interface TaskDistributionRow {
  orgId: string;
  leadCount: number;
  participantCount: number;
}

export function getTaskDistribution(
  organisations: Ka220Organisation[],
  workPackages: Ka220WorkPackage[]
): TaskDistributionRow[] {
  return organisations.map((org) => {
    let leadCount = 0;
    let participantCount = 0;
    for (const wp of workPackages) {
      for (const activity of wp.activities) {
        if (activity.leadOrgId === org.id) leadCount += 1;
        if (activity.participatingOrgIds.includes(org.id)) participantCount += 1;
      }
    }
    return { orgId: org.id, leadCount, participantCount };
  });
}
