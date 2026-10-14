"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import type { Locale } from "@/lib/i18n/locale";
import {
  KA220_LUMP_SUM_OPTIONS,
  KA220_PM_MAX_SHARE,
  getTotalBudget,
  getWpOrgAllocationTotal,
  getOrganisationTotals,
  getTaskDistribution,
  type Ka220Organisation,
  type Ka220WorkPackage,
  type Ka220Activity,
} from "@/lib/budget/ka220";

const inputClass =
  "w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const FIELDS_TR = ["Okul Eğitimi", "Mesleki Eğitim ve Öğretim", "Yetişkin Eğitimi", "Gençlik", "Yükseköğretim"];
const FIELDS_EN = ["School Education", "Vocational Education and Training", "Adult Education", "Youth", "Higher Education"];

const STRINGS = {
  tr: {
    intro: "Doldurdukça bütçe kontrolleri ve ödeme simülasyonu otomatik güncellenir. Hazır olduğunda PDF indirin.",
    downloadPdf: "PDF Olarak İndir",
    generalInfo: "Genel Bilgiler",
    projectTitle: "Proje Başlığı",
    field: "Alan",
    lumpSumLabel: "Lump Sum (Erasmus+ Programme Guide'a göre üç sabit tutardan biri seçilir)",
    organisations: "Katılımcı Kuruluşlar",
    addPartner: "+ Ortak Ekle",
    coordinator: "Koordinatör",
    partner: "Ortak",
    orgNamePlaceholder: "Kuruluş adı",
    countryPlaceholder: "Ülke",
    cityPlaceholder: "Şehir",
    orgTypePlaceholder: "Kuruluş türü (örn. Okul)",
    newcomer: "Programa yeni katılımcı",
    removeOrg: "Kuruluşu Kaldır",
    workPackages: "İş Paketleri (Work Packages)",
    addWorkPackage: "+ İş Paketi Ekle",
    wpHelpText:
      "WP1 (Proje Yönetimi) toplam lump sum'ın en fazla %20'si olabilir. Görev dağılımı alanı, değerlendiricinin “ortaklık kalitesi” puanlamasında önemlidir — her ortağın bu iş paketindeki somut görevini yazın.",
    projectManagement: "Proje Yönetimi",
    wpTitlePlaceholder: "İş paketi başlığı",
    remove: "Kaldır",
    budgetEur: "Bütçe (EUR)",
    pmShareText: (pct: string) => `Lump sum'ın %${pct}'i`,
    pmShareExceeded: "— %20 sınırı aşıldı!",
    wpOrgAllocationTitle: "Bu İş Paketinin Kuruluşlara Dağılımı (EUR)",
    wpOrgAllocationMismatch: (distributed: string, budget: string) =>
      `Kuruluşlara dağıtılan toplam (${distributed}) iş paketi bütçesiyle (${budget}) eşleşmiyor.`,
    specificObjectives: "Spesifik Hedefler",
    mainResults: "Ana Sonuçlar",
    qualitativeIndicators: "Nitel Göstergeler",
    quantitativeIndicators: "Nicel Göstergeler",
    taskAllocation: "Görev Dağılımı (her ortağın bu iş paketindeki görev ve sorumlulukları)",
    taskAllocationPlaceholder:
      "örn. Koordinatör: genel koordinasyon ve raporlama; Ortak 1: müfredat geliştirme; Ortak 2: pilot uygulama...",
    budgetJustification: "Bütçe Gerekçesi (tutar nasıl belirlendi, maliyet etkinliği nasıl doğrulandı)",
    activities: "Faaliyetler",
    addActivity: "+ Faaliyet Ekle",
    activityNamePlaceholder: "Faaliyet adı",
    venuePlaceholder: "Yer",
    startDate: "Başlangıç",
    endDate: "Bitiş",
    leadOrg: "Yürütücü Kuruluş",
    select: "Seçiniz",
    amountEur: "Tutar (EUR)",
    participatingOrgs: "Katılımcı Kuruluşlar",
    expectedResultsPlaceholder: "Beklenen sonuçlar",
    removeActivity: "Faaliyeti Kaldır",
    budgetSummary: "Bütçe Özeti",
    wpColumn: "İş Paketi",
    budgetColumn: "Bütçe (EUR)",
    lumpSumShareColumn: "Lump Sum İçindeki Pay",
    totalDistributed: "Toplam Dağıtılan",
    totalMismatch: (distributed: string, lumpSum: string) =>
      `Toplam dağıtılan tutar (${distributed}), seçilen lump sum (${lumpSum}) ile eşleşmiyor.`,
    orgDistributionTitle: "Kuruluşlara Göre Dağılım (İş Paketi Bazında)",
    orgColumn: "Kuruluş",
    totalColumn: "Toplam",
    taskSummaryTitle: "Görev Dağılımı Özeti (faaliyet tablolarından otomatik hesaplanır)",
    leadCountColumn: "Yürütücü olduğu faaliyet",
    participantCountColumn: "Katıldığı faaliyet",
    taskSummaryNote:
      "Değerlendiriciler “ortaklık ve iş birliği düzenlemeleri” kriterinde tüm kuruluşların aktif katkısını arar; bu tablo görev dağılımının dengeli olup olmadığını görmenize yardımcı olur.",
    unnamedOrg: "İsimsiz kuruluş",
  },
  en: {
    intro:
      "Budget checks and the payment simulation update automatically as you fill in the form. Download the PDF when ready.",
    downloadPdf: "Download as PDF",
    generalInfo: "General Information",
    projectTitle: "Project Title",
    field: "Field",
    lumpSumLabel: "Lump Sum (choose one of the three fixed amounts set out in the Erasmus+ Programme Guide)",
    organisations: "Participating Organisations",
    addPartner: "+ Add Partner",
    coordinator: "Coordinator",
    partner: "Partner",
    orgNamePlaceholder: "Organisation name",
    countryPlaceholder: "Country",
    cityPlaceholder: "City",
    orgTypePlaceholder: "Organisation type (e.g. School)",
    newcomer: "New to the programme",
    removeOrg: "Remove Organisation",
    workPackages: "Work Packages",
    addWorkPackage: "+ Add Work Package",
    wpHelpText:
      "WP1 (Project Management) can be at most 20% of the total lump sum. The task allocation field matters for the evaluator’s “quality of the partnership” scoring — write each partner’s concrete task within this work package.",
    projectManagement: "Project Management",
    wpTitlePlaceholder: "Work package title",
    remove: "Remove",
    budgetEur: "Budget (EUR)",
    pmShareText: (pct: string) => `${pct}% of the lump sum`,
    pmShareExceeded: "— 20% limit exceeded!",
    wpOrgAllocationTitle: "Distribution of This Work Package Across Organisations (EUR)",
    wpOrgAllocationMismatch: (distributed: string, budget: string) =>
      `The total distributed to organisations (${distributed}) does not match the work package budget (${budget}).`,
    specificObjectives: "Specific Objectives",
    mainResults: "Main Results",
    qualitativeIndicators: "Qualitative Indicators",
    quantitativeIndicators: "Quantitative Indicators",
    taskAllocation: "Task Allocation (each partner's tasks and responsibilities within this work package)",
    taskAllocationPlaceholder:
      "e.g. Coordinator: overall coordination and reporting; Partner 1: curriculum development; Partner 2: pilot implementation...",
    budgetJustification: "Budget Justification (how the amount was determined, how cost-effectiveness was verified)",
    activities: "Activities",
    addActivity: "+ Add Activity",
    activityNamePlaceholder: "Activity name",
    venuePlaceholder: "Venue",
    startDate: "Start Date",
    endDate: "End Date",
    leadOrg: "Lead Organisation",
    select: "Select",
    amountEur: "Amount (EUR)",
    participatingOrgs: "Participating Organisations",
    expectedResultsPlaceholder: "Expected results",
    removeActivity: "Remove Activity",
    budgetSummary: "Budget Summary",
    wpColumn: "Work Package",
    budgetColumn: "Budget (EUR)",
    lumpSumShareColumn: "Share of Lump Sum",
    totalDistributed: "Total Distributed",
    totalMismatch: (distributed: string, lumpSum: string) =>
      `The total distributed amount (${distributed}) does not match the selected lump sum (${lumpSum}).`,
    orgDistributionTitle: "Distribution by Organisation (per Work Package)",
    orgColumn: "Organisation",
    totalColumn: "Total",
    taskSummaryTitle: "Task Allocation Summary (calculated automatically from the activity tables)",
    leadCountColumn: "Activities as lead",
    participantCountColumn: "Activities as participant",
    taskSummaryNote:
      "Evaluators look for the active contribution of all organisations under the “partnership and cooperation arrangements” criterion; this table helps you see whether the task allocation is balanced.",
    unnamedOrg: "Unnamed organisation",
  },
} as const;

function formatEur(value: number, locale: Locale) {
  return `${(value || 0).toLocaleString(locale === "en" ? "en-GB" : "tr-TR", { maximumFractionDigits: 0 })} €`;
}

function formatPercent(pct: string, locale: Locale) {
  return locale === "en" ? `${pct}%` : `%${pct}`;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={inputClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}

export function Ka220BudgetCalculator({ locale = "tr" }: { locale?: Locale } = {}) {
  const reactId = useId();
  const t = STRINGS[locale];
  const FIELDS = locale === "en" ? FIELDS_EN : FIELDS_TR;

  const [field, setField] = useState(FIELDS[0]);
  const [projectTitle, setProjectTitle] = useState("");
  const [lumpSum, setLumpSum] = useState<number>(KA220_LUMP_SUM_OPTIONS[0]);

  const [organisations, setOrganisations] = useState<Ka220Organisation[]>([
    {
      id: `${reactId}-org-coord`,
      role: "coordinator",
      name: "",
      country: "",
      city: "",
      organisationType: "",
      isNewcomer: false,
    },
    {
      id: `${reactId}-org-p1`,
      role: "partner",
      name: "",
      country: "",
      city: "",
      organisationType: "",
      isNewcomer: false,
    },
  ]);

  const [workPackages, setWorkPackages] = useState<Ka220WorkPackage[]>([
    {
      id: "WP1",
      title: t.projectManagement,
      isProjectManagement: true,
      budget: 0,
      specificObjectives: "",
      mainResults: "",
      qualitativeIndicators: "",
      quantitativeIndicators: "",
      taskAllocation: "",
      budgetJustification: "",
      activities: [],
      orgAllocations: {},
    },
    {
      id: "WP2",
      title: "",
      isProjectManagement: false,
      budget: 0,
      specificObjectives: "",
      mainResults: "",
      qualitativeIndicators: "",
      quantitativeIndicators: "",
      taskAllocation: "",
      budgetJustification: "",
      activities: [],
      orgAllocations: {},
    },
  ]);

  function addOrganisation() {
    setOrganisations((prev) => [
      ...prev,
      {
        id: `${reactId}-org-${Date.now()}`,
        role: "partner",
        name: "",
        country: "",
        city: "",
        organisationType: "",
        isNewcomer: false,
      },
    ]);
  }

  function updateOrganisation(id: string, patch: Partial<Ka220Organisation>) {
    setOrganisations((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  function removeOrganisation(id: string) {
    setOrganisations((prev) => prev.filter((o) => o.id !== id));
    setWorkPackages((prev) =>
      prev.map((wp) => {
        const rest = { ...wp.orgAllocations };
        delete rest[id];
        return {
          ...wp,
          orgAllocations: rest,
          activities: wp.activities.map((a) => ({
            ...a,
            leadOrgId: a.leadOrgId === id ? "" : a.leadOrgId,
            participatingOrgIds: a.participatingOrgIds.filter((o) => o !== id),
          })),
        };
      })
    );
  }

  function addWorkPackage() {
    const nextNumber = workPackages.length + 1;
    setWorkPackages((prev) => [
      ...prev,
      {
        id: `WP${nextNumber}`,
        title: "",
        isProjectManagement: false,
        budget: 0,
        specificObjectives: "",
        mainResults: "",
        qualitativeIndicators: "",
        quantitativeIndicators: "",
        taskAllocation: "",
        budgetJustification: "",
        activities: [],
        orgAllocations: {},
      },
    ]);
  }

  function updateWorkPackage(id: string, patch: Partial<Ka220WorkPackage>) {
    setWorkPackages((prev) => prev.map((wp) => (wp.id === id ? { ...wp, ...patch } : wp)));
  }

  function removeWorkPackage(id: string) {
    setWorkPackages((prev) => prev.filter((wp) => wp.id !== id));
  }

  function setOrgAllocation(wpId: string, orgId: string, amount: number) {
    setWorkPackages((prev) =>
      prev.map((wp) => (wp.id === wpId ? { ...wp, orgAllocations: { ...wp.orgAllocations, [orgId]: amount } } : wp))
    );
  }

  function addActivity(wpId: string) {
    setWorkPackages((prev) =>
      prev.map((wp) =>
        wp.id === wpId
          ? {
              ...wp,
              activities: [
                ...wp.activities,
                {
                  id: `${reactId}-act-${Date.now()}`,
                  title: "",
                  venue: "",
                  startDate: "",
                  endDate: "",
                  leadOrgId: organisations[0]?.id ?? "",
                  participatingOrgIds: [],
                  amount: 0,
                  expectedResults: "",
                },
              ],
            }
          : wp
      )
    );
  }

  function updateActivity(wpId: string, activityId: string, patch: Partial<Ka220Activity>) {
    setWorkPackages((prev) =>
      prev.map((wp) =>
        wp.id === wpId
          ? { ...wp, activities: wp.activities.map((a) => (a.id === activityId ? { ...a, ...patch } : a)) }
          : wp
      )
    );
  }

  function removeActivity(wpId: string, activityId: string) {
    setWorkPackages((prev) =>
      prev.map((wp) => (wp.id === wpId ? { ...wp, activities: wp.activities.filter((a) => a.id !== activityId) } : wp))
    );
  }

  function toggleParticipating(wpId: string, activityId: string, orgId: string) {
    setWorkPackages((prev) =>
      prev.map((wp) =>
        wp.id === wpId
          ? {
              ...wp,
              activities: wp.activities.map((a) =>
                a.id === activityId
                  ? {
                      ...a,
                      participatingOrgIds: a.participatingOrgIds.includes(orgId)
                        ? a.participatingOrgIds.filter((o) => o !== orgId)
                        : [...a.participatingOrgIds, orgId],
                    }
                  : a
              ),
            }
          : wp
      )
    );
  }

  const totalBudget = getTotalBudget(workPackages);
  const pmWp = workPackages.find((wp) => wp.isProjectManagement);
  const pmShare = lumpSum ? (pmWp?.budget ?? 0) / lumpSum : 0;
  const budgetMatchesLumpSum = totalBudget === lumpSum;
  const orgTotals = getOrganisationTotals(organisations, workPackages);
  const taskDistribution = getTaskDistribution(organisations, workPackages);

  const orgName = (id: string) => organisations.find((o) => o.id === id)?.name || t.unnamedOrg;

  async function handleDownloadPdf() {
    const { generateKa220BudgetPdf } = await import("@/lib/pdf/generateKa220BudgetPdf");
    generateKa220BudgetPdf({
      projectTitle,
      field,
      lumpSum,
      organisations,
      workPackages,
      orgTotals,
      taskDistribution,
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {t.intro}
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="cursor-pointer shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          {t.downloadPdf}
        </button>
      </div>

      <div className="space-y-6">
        {/* Genel bilgiler */}
        <Card>
          <h4 className="mb-3 font-medium text-foreground">{t.generalInfo}</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t.projectTitle} value={projectTitle} onChange={setProjectTitle} />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">{t.field}</span>
              <select value={field} onChange={(e) => setField(e.target.value)} className={inputClass}>
                {FIELDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {t.lumpSumLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {KA220_LUMP_SUM_OPTIONS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setLumpSum(amount)}
                  className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    lumpSum === amount
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-foreground hover:border-accent/50"
                  }`}
                >
                  {formatEur(amount, locale)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Kuruluşlar */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-foreground">{t.organisations}</h4>
            <button
              type="button"
              onClick={addOrganisation}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              {t.addPartner}
            </button>
          </div>
          <div className="space-y-3">
            {organisations.map((org) => (
              <div key={org.id} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-6">
                <span className="flex items-center text-xs font-medium text-muted-foreground sm:col-span-1">
                  {org.role === "coordinator" ? t.coordinator : t.partner}
                </span>
                <input
                  value={org.name}
                  onChange={(e) => updateOrganisation(org.id, { name: e.target.value })}
                  placeholder={t.orgNamePlaceholder}
                  className={`${inputClass} sm:col-span-2`}
                />
                <input
                  value={org.country}
                  onChange={(e) => updateOrganisation(org.id, { country: e.target.value })}
                  placeholder={t.countryPlaceholder}
                  className={inputClass}
                />
                <input
                  value={org.city}
                  onChange={(e) => updateOrganisation(org.id, { city: e.target.value })}
                  placeholder={t.cityPlaceholder}
                  className={inputClass}
                />
                <input
                  value={org.organisationType}
                  onChange={(e) => updateOrganisation(org.id, { organisationType: e.target.value })}
                  placeholder={t.orgTypePlaceholder}
                  className={inputClass}
                />
                {org.role === "partner" && (
                  <div className="flex items-center justify-between sm:col-span-6">
                    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={org.isNewcomer}
                        onChange={(e) => updateOrganisation(org.id, { isNewcomer: e.target.checked })}
                        className="h-4 w-4 rounded border-border accent-accent"
                      />
                      {t.newcomer}
                    </label>
                    <button
                      type="button"
                      onClick={() => removeOrganisation(org.id)}
                      className="cursor-pointer text-xs text-red-600"
                    >
                      {t.removeOrg}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* İş Paketleri */}
        <Card>
          <div className="mb-1 flex items-center justify-between">
            <h4 className="font-medium text-foreground">{t.workPackages}</h4>
            <button
              type="button"
              onClick={addWorkPackage}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              {t.addWorkPackage}
            </button>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            {t.wpHelpText}
          </p>

          <div className="space-y-5">
            {workPackages.map((wp) => {
              const orgAllocTotal = getWpOrgAllocationTotal(wp);
              const orgAllocMismatch = Math.round(orgAllocTotal) !== Math.round(wp.budget || 0);
              return (
                <div key={wp.id} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                      {wp.id}
                    </span>
                    {wp.isProjectManagement ? (
                      <span className="flex-1 text-sm font-medium text-foreground">{t.projectManagement}</span>
                    ) : (
                      <input
                        value={wp.title}
                        onChange={(e) => updateWorkPackage(wp.id, { title: e.target.value })}
                        placeholder={t.wpTitlePlaceholder}
                        className={`${inputClass} flex-1`}
                      />
                    )}
                    {!wp.isProjectManagement && (
                      <button
                        type="button"
                        onClick={() => removeWorkPackage(wp.id)}
                        className="cursor-pointer shrink-0 text-xs text-red-600"
                      >
                        {t.remove}
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">{t.budgetEur}</span>
                      <input
                        type="number"
                        min={0}
                        value={wp.budget || ""}
                        onChange={(e) => updateWorkPackage(wp.id, { budget: Number(e.target.value) || 0 })}
                        className={inputClass}
                      />
                    </label>
                    {wp.isProjectManagement && (
                      <div className="flex items-end">
                        <p
                          className={`text-xs ${pmShare > KA220_PM_MAX_SHARE ? "font-medium text-red-600" : "text-muted-foreground"}`}
                        >
                          {t.pmShareText((pmShare * 100).toFixed(1))} {pmShare > KA220_PM_MAX_SHARE && t.pmShareExceeded}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Kuruluşlara bütçe dağılımı */}
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      {t.wpOrgAllocationTitle}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {organisations.map((org) => (
                        <label key={org.id} className="block">
                          <span className="mb-1 block text-xs text-muted-foreground">
                            {org.name || (org.role === "coordinator" ? t.coordinator : t.partner)}
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={wp.orgAllocations[org.id] || ""}
                            onChange={(e) => setOrgAllocation(wp.id, org.id, Number(e.target.value) || 0)}
                            className={inputClass}
                          />
                        </label>
                      ))}
                    </div>
                    {orgAllocMismatch && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {t.wpOrgAllocationMismatch(formatEur(orgAllocTotal, locale), formatEur(wp.budget, locale))}
                      </p>
                    )}
                  </div>

                  {!wp.isProjectManagement && (
                    <>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <Field
                          label={t.specificObjectives}
                          value={wp.specificObjectives}
                          onChange={(v) => updateWorkPackage(wp.id, { specificObjectives: v })}
                          textarea
                        />
                        <Field
                          label={t.mainResults}
                          value={wp.mainResults}
                          onChange={(v) => updateWorkPackage(wp.id, { mainResults: v })}
                          textarea
                        />
                        <Field
                          label={t.qualitativeIndicators}
                          value={wp.qualitativeIndicators}
                          onChange={(v) => updateWorkPackage(wp.id, { qualitativeIndicators: v })}
                          textarea
                        />
                        <Field
                          label={t.quantitativeIndicators}
                          value={wp.quantitativeIndicators}
                          onChange={(v) => updateWorkPackage(wp.id, { quantitativeIndicators: v })}
                          textarea
                        />
                      </div>
                      <div className="mt-3">
                        <Field
                          label={t.taskAllocation}
                          value={wp.taskAllocation}
                          onChange={(v) => updateWorkPackage(wp.id, { taskAllocation: v })}
                          placeholder={t.taskAllocationPlaceholder}
                          textarea
                        />
                      </div>
                      <div className="mt-3">
                        <Field
                          label={t.budgetJustification}
                          value={wp.budgetJustification}
                          onChange={(v) => updateWorkPackage(wp.id, { budgetJustification: v })}
                          textarea
                        />
                      </div>

                      {/* Faaliyetler */}
                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-medium text-muted-foreground">{t.activities}</p>
                          <button
                            type="button"
                            onClick={() => addActivity(wp.id)}
                            className="cursor-pointer rounded-lg border border-border px-2.5 py-1 text-xs text-foreground transition-colors duration-200 hover:border-accent/50"
                          >
                            {t.addActivity}
                          </button>
                        </div>
                        <div className="space-y-3">
                          {wp.activities.map((activity) => (
                            <div key={activity.id} className="rounded-lg border border-border p-3">
                              <div className="grid gap-2 sm:grid-cols-2">
                                <input
                                  value={activity.title}
                                  onChange={(e) => updateActivity(wp.id, activity.id, { title: e.target.value })}
                                  placeholder={t.activityNamePlaceholder}
                                  className={inputClass}
                                />
                                <input
                                  value={activity.venue}
                                  onChange={(e) => updateActivity(wp.id, activity.id, { venue: e.target.value })}
                                  placeholder={t.venuePlaceholder}
                                  className={inputClass}
                                />
                                <label className="block">
                                  <span className="mb-1 block text-xs text-muted-foreground">{t.startDate}</span>
                                  <input
                                    type="date"
                                    value={activity.startDate}
                                    onChange={(e) => updateActivity(wp.id, activity.id, { startDate: e.target.value })}
                                    className={inputClass}
                                  />
                                </label>
                                <label className="block">
                                  <span className="mb-1 block text-xs text-muted-foreground">{t.endDate}</span>
                                  <input
                                    type="date"
                                    value={activity.endDate}
                                    onChange={(e) => updateActivity(wp.id, activity.id, { endDate: e.target.value })}
                                    className={inputClass}
                                  />
                                </label>
                                <label className="block">
                                  <span className="mb-1 block text-xs text-muted-foreground">{t.leadOrg}</span>
                                  <select
                                    value={activity.leadOrgId}
                                    onChange={(e) => updateActivity(wp.id, activity.id, { leadOrgId: e.target.value })}
                                    className={inputClass}
                                  >
                                    <option value="">{t.select}</option>
                                    {organisations.map((org) => (
                                      <option key={org.id} value={org.id}>
                                        {org.name || (org.role === "coordinator" ? t.coordinator : t.partner)}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="block">
                                  <span className="mb-1 block text-xs text-muted-foreground">{t.amountEur}</span>
                                  <input
                                    type="number"
                                    min={0}
                                    value={activity.amount || ""}
                                    onChange={(e) =>
                                      updateActivity(wp.id, activity.id, { amount: Number(e.target.value) || 0 })
                                    }
                                    className={inputClass}
                                  />
                                </label>
                              </div>
                              <div className="mt-2">
                                <p className="mb-1 text-xs text-muted-foreground">{t.participatingOrgs}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                  {organisations.map((org) => (
                                    <label key={org.id} className="flex cursor-pointer select-none items-center gap-1.5 text-xs text-foreground">
                                      <input
                                        type="checkbox"
                                        checked={activity.participatingOrgIds.includes(org.id)}
                                        onChange={() => toggleParticipating(wp.id, activity.id, org.id)}
                                        className="h-3.5 w-3.5 rounded border-border accent-accent"
                                      />
                                      {org.name || (org.role === "coordinator" ? t.coordinator : t.partner)}
                                    </label>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-2">
                                <textarea
                                  value={activity.expectedResults}
                                  onChange={(e) =>
                                    updateActivity(wp.id, activity.id, { expectedResults: e.target.value })
                                  }
                                  placeholder={t.expectedResultsPlaceholder}
                                  rows={2}
                                  className={inputClass}
                                />
                              </div>
                              <div className="mt-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeActivity(wp.id, activity.id)}
                                  className="cursor-pointer text-xs text-red-600"
                                >
                                  {t.removeActivity}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Bütçe Özeti */}
        <Card>
          <h4 className="mb-3 font-medium text-foreground">{t.budgetSummary}</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-muted p-2 text-left">{t.wpColumn}</th>
                  <th className="border border-border bg-muted p-2 text-right">{t.budgetColumn}</th>
                  <th className="border border-border bg-muted p-2 text-right">{t.lumpSumShareColumn}</th>
                </tr>
              </thead>
              <tbody>
                {workPackages.map((wp) => (
                  <tr key={wp.id}>
                    <td className="border border-border p-2">
                      {wp.id}: {wp.title || (wp.isProjectManagement ? t.projectManagement : "—")}
                    </td>
                    <td className="border border-border p-2 text-right">{formatEur(wp.budget, locale)}</td>
                    <td className="border border-border p-2 text-right">
                      {lumpSum
                        ? formatPercent((((wp.budget || 0) / lumpSum) * 100).toFixed(1), locale)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border border-border p-2 font-semibold">{t.totalDistributed}</td>
                  <td className="border border-border p-2 text-right font-semibold">{formatEur(totalBudget, locale)}</td>
                  <td className="border border-border p-2 text-right font-semibold">
                    {lumpSum ? formatPercent(((totalBudget / lumpSum) * 100).toFixed(1), locale) : "—"}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {!budgetMatchesLumpSum && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {t.totalMismatch(formatEur(totalBudget, locale), formatEur(lumpSum, locale))}
            </p>
          )}

          <p className="mb-2 mt-6 text-xs font-medium text-muted-foreground">
            {t.orgDistributionTitle}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-muted p-2 text-left">{t.orgColumn}</th>
                  {workPackages.map((wp) => (
                    <th key={wp.id} className="border border-border bg-muted p-2 text-right">
                      {wp.id}
                    </th>
                  ))}
                  <th className="border border-border bg-muted p-2 text-right">{t.totalColumn}</th>
                </tr>
              </thead>
              <tbody>
                {orgTotals.map((row) => (
                  <tr key={row.orgId}>
                    <td className="border border-border p-2">{orgName(row.orgId)}</td>
                    {workPackages.map((wp) => (
                      <td key={wp.id} className="border border-border p-2 text-right">
                        {formatEur(row.perWp[wp.id] || 0, locale)}
                      </td>
                    ))}
                    <td className="border border-border p-2 text-right font-semibold">{formatEur(row.total, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mb-2 mt-6 text-xs font-medium text-muted-foreground">
            {t.taskSummaryTitle}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-muted p-2 text-left">{t.orgColumn}</th>
                  <th className="border border-border bg-muted p-2 text-right">{t.leadCountColumn}</th>
                  <th className="border border-border bg-muted p-2 text-right">{t.participantCountColumn}</th>
                </tr>
              </thead>
              <tbody>
                {taskDistribution.map((row) => (
                  <tr key={row.orgId}>
                    <td className="border border-border p-2">{orgName(row.orgId)}</td>
                    <td className="border border-border p-2 text-right">{row.leadCount}</td>
                    <td className="border border-border p-2 text-right">{row.participantCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {t.taskSummaryNote}
          </p>
        </Card>
      </div>
    </div>
  );
}
