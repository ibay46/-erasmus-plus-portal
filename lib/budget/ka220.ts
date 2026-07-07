// KA220 Cooperation Partnerships (2021-2027 Erasmus+ Programme Guide) sabit lump sum modeli.
// Detaylı harcama kalemi (seyahat, günlük bireysel destek vb.) istenmez; başvuru, seçilen lump sum'ın
// iş paketlerine ve iş paketlerinin kuruluşlara nasıl dağıtıldığını gösterir.
export const KA220_LUMP_SUM_OPTIONS = [120000, 250000, 400000] as const;
export type Ka220LumpSum = (typeof KA220_LUMP_SUM_OPTIONS)[number];

// Proje Yönetimi (WP1) iş paketi, toplam lump sum'ın en fazla %20'sini kapsayabilir.
export const KA220_PM_MAX_SHARE = 0.2;

// Cooperation Partnerships kalite değerlendirme / hibe ödeme ölçeği (Handbook on the lump sum funding model).
export const KA220_PAYMENT_SCALE = [
  { minScore: 70, percentage: 100 },
  { minScore: 55, percentage: 90 },
  { minScore: 40, percentage: 60 },
  { minScore: 0, percentage: 30 },
];

export function getKa220PaymentPercentage(score: number): number {
  const tier = KA220_PAYMENT_SCALE.find((t) => score >= t.minScore);
  return tier ? tier.percentage : 0;
}

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
  qualityScore: number;
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

export interface PaymentSimulationResult {
  overallScore: number;
  overallScoreSufficient: boolean;
  overallPaymentPercentage: number;
  overallPaymentAmount: number;
  effectivePaymentPercentage: number;
  perWorkPackage: {
    id: string;
    title: string;
    budget: number;
    score: number;
    paymentPercentage: number;
    paymentAmount: number;
  }[];
  totalPaid: number;
}

// Cooperation Partnerships kural: proje puanı >=70 ise indirim sadece 70'in altındaki iş paketlerine
// uygulanır; proje puanı <70 ise indirim tüm hibeye (iş paketi bazında değil) uygulanır.
export function simulateKa220Payment(
  workPackages: Ka220WorkPackage[],
  lumpSum: number
): PaymentSimulationResult {
  const totalBudget = getTotalBudget(workPackages) || 1;
  const overallScore = Math.round(
    workPackages.reduce((sum, wp) => sum + wp.qualityScore * (wp.budget || 0), 0) / totalBudget
  );
  const overallScoreSufficient = overallScore >= 70;
  const overallPaymentPercentage = getKa220PaymentPercentage(overallScore);

  const perWorkPackage = workPackages.map((wp) => {
    const paymentPercentage = overallScoreSufficient
      ? getKa220PaymentPercentage(wp.qualityScore)
      : overallPaymentPercentage;
    return {
      id: wp.id,
      title: wp.title,
      budget: wp.budget || 0,
      score: wp.qualityScore,
      paymentPercentage,
      paymentAmount: ((wp.budget || 0) * paymentPercentage) / 100,
    };
  });

  const totalPaid = overallScoreSufficient
    ? perWorkPackage.reduce((sum, wp) => sum + wp.paymentAmount, 0)
    : (lumpSum * overallPaymentPercentage) / 100;

  const effectivePaymentPercentage = lumpSum ? Math.round((totalPaid / lumpSum) * 1000) / 10 : 0;

  return {
    overallScore,
    overallScoreSufficient,
    overallPaymentPercentage,
    overallPaymentAmount: (lumpSum * overallPaymentPercentage) / 100,
    effectivePaymentPercentage,
    perWorkPackage,
    totalPaid,
  };
}
