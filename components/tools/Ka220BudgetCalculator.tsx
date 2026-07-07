"use client";

import { useId, useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  KA220_LUMP_SUM_OPTIONS,
  KA220_PM_MAX_SHARE,
  getTotalBudget,
  getWpOrgAllocationTotal,
  getOrganisationTotals,
  getTaskDistribution,
  simulateKa220Payment,
  type Ka220Organisation,
  type Ka220WorkPackage,
  type Ka220Activity,
} from "@/lib/budget/ka220";

const inputClass =
  "w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/30";

const FIELDS = ["Okul Eğitimi", "Mesleki Eğitim ve Öğretim", "Yetişkin Eğitimi", "Gençlik", "Yükseköğretim"];

function formatEur(value: number) {
  return `${(value || 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} €`;
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

export function Ka220BudgetCalculator() {
  const reactId = useId();

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
      title: "Proje Yönetimi",
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
      qualityScore: 100,
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
      qualityScore: 100,
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
        qualityScore: 100,
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
  const paymentSimulation = simulateKa220Payment(workPackages, lumpSum);

  const orgName = (id: string) => organisations.find((o) => o.id === id)?.name || "İsimsiz kuruluş";

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
      paymentSimulation,
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Doldurdukça bütçe kontrolleri ve ödeme simülasyonu otomatik güncellenir. Hazır olduğunda PDF indirin.
        </p>
        <button
          type="button"
          onClick={handleDownloadPdf}
          className="cursor-pointer shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
        >
          PDF Olarak İndir
        </button>
      </div>

      <div className="space-y-6">
        {/* Genel bilgiler */}
        <Card>
          <h4 className="mb-3 font-medium text-foreground">Genel Bilgiler</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Proje Başlığı" value={projectTitle} onChange={setProjectTitle} />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Alan</span>
              <select value={field} onChange={(e) => setField(e.target.value)} className={inputClass}>
                {FIELDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Lump Sum (Erasmus+ Programme Guide&apos;a göre üç sabit tutardan biri seçilir)
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
                  {formatEur(amount)}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Kuruluşlar */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-foreground">Katılımcı Kuruluşlar</h4>
            <button
              type="button"
              onClick={addOrganisation}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + Ortak Ekle
            </button>
          </div>
          <div className="space-y-3">
            {organisations.map((org) => (
              <div key={org.id} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-6">
                <span className="flex items-center text-xs font-medium text-muted-foreground sm:col-span-1">
                  {org.role === "coordinator" ? "Koordinatör" : "Ortak"}
                </span>
                <input
                  value={org.name}
                  onChange={(e) => updateOrganisation(org.id, { name: e.target.value })}
                  placeholder="Kuruluş adı"
                  className={`${inputClass} sm:col-span-2`}
                />
                <input
                  value={org.country}
                  onChange={(e) => updateOrganisation(org.id, { country: e.target.value })}
                  placeholder="Ülke"
                  className={inputClass}
                />
                <input
                  value={org.city}
                  onChange={(e) => updateOrganisation(org.id, { city: e.target.value })}
                  placeholder="Şehir"
                  className={inputClass}
                />
                <input
                  value={org.organisationType}
                  onChange={(e) => updateOrganisation(org.id, { organisationType: e.target.value })}
                  placeholder="Kuruluş türü (örn. Okul)"
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
                      Programa yeni katılımcı
                    </label>
                    <button
                      type="button"
                      onClick={() => removeOrganisation(org.id)}
                      className="cursor-pointer text-xs text-red-600"
                    >
                      Kuruluşu Kaldır
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
            <h4 className="font-medium text-foreground">İş Paketleri (Work Packages)</h4>
            <button
              type="button"
              onClick={addWorkPackage}
              className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition-colors duration-200 hover:border-accent/50"
            >
              + İş Paketi Ekle
            </button>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            WP1 (Proje Yönetimi) toplam lump sum&apos;ın en fazla %20&apos;si olabilir. Görev dağılımı alanı,
            değerlendiricinin &quot;ortaklık kalitesi&quot; puanlamasında önemlidir — her ortağın bu iş
            paketindeki somut görevini yazın.
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
                      <span className="flex-1 text-sm font-medium text-foreground">Proje Yönetimi</span>
                    ) : (
                      <input
                        value={wp.title}
                        onChange={(e) => updateWorkPackage(wp.id, { title: e.target.value })}
                        placeholder="İş paketi başlığı"
                        className={`${inputClass} flex-1`}
                      />
                    )}
                    {!wp.isProjectManagement && (
                      <button
                        type="button"
                        onClick={() => removeWorkPackage(wp.id)}
                        className="cursor-pointer shrink-0 text-xs text-red-600"
                      >
                        Kaldır
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Bütçe (EUR)</span>
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
                          Lump sum&apos;ın %{(pmShare * 100).toFixed(1)}&apos;i {pmShare > KA220_PM_MAX_SHARE && "— %20 sınırı aşıldı!"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Kuruluşlara bütçe dağılımı */}
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Bu İş Paketinin Kuruluşlara Dağılımı (EUR)
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {organisations.map((org) => (
                        <label key={org.id} className="block">
                          <span className="mb-1 block text-xs text-muted-foreground">
                            {org.name || (org.role === "coordinator" ? "Koordinatör" : "Ortak")}
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
                        Kuruluşlara dağıtılan toplam ({formatEur(orgAllocTotal)}) iş paketi bütçesiyle (
                        {formatEur(wp.budget)}) eşleşmiyor.
                      </p>
                    )}
                  </div>

                  {!wp.isProjectManagement && (
                    <>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <Field
                          label="Spesifik Hedefler"
                          value={wp.specificObjectives}
                          onChange={(v) => updateWorkPackage(wp.id, { specificObjectives: v })}
                          textarea
                        />
                        <Field
                          label="Ana Sonuçlar"
                          value={wp.mainResults}
                          onChange={(v) => updateWorkPackage(wp.id, { mainResults: v })}
                          textarea
                        />
                        <Field
                          label="Nitel Göstergeler"
                          value={wp.qualitativeIndicators}
                          onChange={(v) => updateWorkPackage(wp.id, { qualitativeIndicators: v })}
                          textarea
                        />
                        <Field
                          label="Nicel Göstergeler"
                          value={wp.quantitativeIndicators}
                          onChange={(v) => updateWorkPackage(wp.id, { quantitativeIndicators: v })}
                          textarea
                        />
                      </div>
                      <div className="mt-3">
                        <Field
                          label="Görev Dağılımı (her ortağın bu iş paketindeki görev ve sorumlulukları)"
                          value={wp.taskAllocation}
                          onChange={(v) => updateWorkPackage(wp.id, { taskAllocation: v })}
                          placeholder="örn. Koordinatör: genel koordinasyon ve raporlama; Ortak 1: müfredat geliştirme; Ortak 2: pilot uygulama..."
                          textarea
                        />
                      </div>
                      <div className="mt-3">
                        <Field
                          label="Bütçe Gerekçesi (tutar nasıl belirlendi, maliyet etkinliği nasıl doğrulandı)"
                          value={wp.budgetJustification}
                          onChange={(v) => updateWorkPackage(wp.id, { budgetJustification: v })}
                          textarea
                        />
                      </div>

                      {/* Faaliyetler */}
                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-medium text-muted-foreground">Faaliyetler</p>
                          <button
                            type="button"
                            onClick={() => addActivity(wp.id)}
                            className="cursor-pointer rounded-lg border border-border px-2.5 py-1 text-xs text-foreground transition-colors duration-200 hover:border-accent/50"
                          >
                            + Faaliyet Ekle
                          </button>
                        </div>
                        <div className="space-y-3">
                          {wp.activities.map((activity) => (
                            <div key={activity.id} className="rounded-lg border border-border p-3">
                              <div className="grid gap-2 sm:grid-cols-2">
                                <input
                                  value={activity.title}
                                  onChange={(e) => updateActivity(wp.id, activity.id, { title: e.target.value })}
                                  placeholder="Faaliyet adı"
                                  className={inputClass}
                                />
                                <input
                                  value={activity.venue}
                                  onChange={(e) => updateActivity(wp.id, activity.id, { venue: e.target.value })}
                                  placeholder="Yer"
                                  className={inputClass}
                                />
                                <label className="block">
                                  <span className="mb-1 block text-xs text-muted-foreground">Başlangıç</span>
                                  <input
                                    type="date"
                                    value={activity.startDate}
                                    onChange={(e) => updateActivity(wp.id, activity.id, { startDate: e.target.value })}
                                    className={inputClass}
                                  />
                                </label>
                                <label className="block">
                                  <span className="mb-1 block text-xs text-muted-foreground">Bitiş</span>
                                  <input
                                    type="date"
                                    value={activity.endDate}
                                    onChange={(e) => updateActivity(wp.id, activity.id, { endDate: e.target.value })}
                                    className={inputClass}
                                  />
                                </label>
                                <label className="block">
                                  <span className="mb-1 block text-xs text-muted-foreground">Yürütücü Kuruluş</span>
                                  <select
                                    value={activity.leadOrgId}
                                    onChange={(e) => updateActivity(wp.id, activity.id, { leadOrgId: e.target.value })}
                                    className={inputClass}
                                  >
                                    <option value="">Seçiniz</option>
                                    {organisations.map((org) => (
                                      <option key={org.id} value={org.id}>
                                        {org.name || (org.role === "coordinator" ? "Koordinatör" : "Ortak")}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="block">
                                  <span className="mb-1 block text-xs text-muted-foreground">Tutar (EUR)</span>
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
                                <p className="mb-1 text-xs text-muted-foreground">Katılımcı Kuruluşlar</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                  {organisations.map((org) => (
                                    <label key={org.id} className="flex cursor-pointer select-none items-center gap-1.5 text-xs text-foreground">
                                      <input
                                        type="checkbox"
                                        checked={activity.participatingOrgIds.includes(org.id)}
                                        onChange={() => toggleParticipating(wp.id, activity.id, org.id)}
                                        className="h-3.5 w-3.5 rounded border-border accent-accent"
                                      />
                                      {org.name || (org.role === "coordinator" ? "Koordinatör" : "Ortak")}
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
                                  placeholder="Beklenen sonuçlar"
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
                                  Faaliyeti Kaldır
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
          <h4 className="mb-3 font-medium text-foreground">Bütçe Özeti</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-muted p-2 text-left">İş Paketi</th>
                  <th className="border border-border bg-muted p-2 text-right">Bütçe (EUR)</th>
                  <th className="border border-border bg-muted p-2 text-right">Lump Sum İçindeki Pay</th>
                </tr>
              </thead>
              <tbody>
                {workPackages.map((wp) => (
                  <tr key={wp.id}>
                    <td className="border border-border p-2">
                      {wp.id}: {wp.title || (wp.isProjectManagement ? "Proje Yönetimi" : "—")}
                    </td>
                    <td className="border border-border p-2 text-right">{formatEur(wp.budget)}</td>
                    <td className="border border-border p-2 text-right">
                      {lumpSum ? `%${(((wp.budget || 0) / lumpSum) * 100).toFixed(1)}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border border-border p-2 font-semibold">Toplam Dağıtılan</td>
                  <td className="border border-border p-2 text-right font-semibold">{formatEur(totalBudget)}</td>
                  <td className="border border-border p-2 text-right font-semibold">
                    {lumpSum ? `%${((totalBudget / lumpSum) * 100).toFixed(1)}` : "—"}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {!budgetMatchesLumpSum && (
            <p className="mt-2 text-xs font-medium text-red-600">
              Toplam dağıtılan tutar ({formatEur(totalBudget)}), seçilen lump sum ({formatEur(lumpSum)}) ile
              eşleşmiyor.
            </p>
          )}

          <p className="mb-2 mt-6 text-xs font-medium text-muted-foreground">
            Kuruluşlara Göre Dağılım (İş Paketi Bazında)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-muted p-2 text-left">Kuruluş</th>
                  {workPackages.map((wp) => (
                    <th key={wp.id} className="border border-border bg-muted p-2 text-right">
                      {wp.id}
                    </th>
                  ))}
                  <th className="border border-border bg-muted p-2 text-right">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {orgTotals.map((row) => (
                  <tr key={row.orgId}>
                    <td className="border border-border p-2">{orgName(row.orgId)}</td>
                    {workPackages.map((wp) => (
                      <td key={wp.id} className="border border-border p-2 text-right">
                        {formatEur(row.perWp[wp.id] || 0)}
                      </td>
                    ))}
                    <td className="border border-border p-2 text-right font-semibold">{formatEur(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mb-2 mt-6 text-xs font-medium text-muted-foreground">
            Görev Dağılımı Özeti (faaliyet tablolarından otomatik hesaplanır)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-muted p-2 text-left">Kuruluş</th>
                  <th className="border border-border bg-muted p-2 text-right">Yürütücü olduğu faaliyet</th>
                  <th className="border border-border bg-muted p-2 text-right">Katıldığı faaliyet</th>
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
            Değerlendiriciler &quot;ortaklık ve iş birliği düzenlemeleri&quot; kriterinde tüm kuruluşların aktif
            katkısını arar; bu tablo görev dağılımının dengeli olup olmadığını görmenize yardımcı olur.
          </p>
        </Card>

        {/* Kalite Puanı / Ödeme Simülatörü */}
        <Card>
          <h4 className="mb-1 font-medium text-foreground">Kalite Puanı / Ödeme Simülatörü</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            Rapor aşamasında her iş paketine verilecek kalite puanını (0-100) girin; ağırlıklı proje puanı ve
            ödenecek tutar otomatik hesaplansın.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-muted p-2 text-left">İş Paketi</th>
                  <th className="border border-border bg-muted p-2 text-right">Bütçe</th>
                  <th className="border border-border bg-muted p-2 text-right">Kalite Puanı (0-100)</th>
                  <th className="border border-border bg-muted p-2 text-right">Ödeme %</th>
                  <th className="border border-border bg-muted p-2 text-right">Ödenecek Tutar</th>
                </tr>
              </thead>
              <tbody>
                {paymentSimulation.perWorkPackage.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-border p-2">
                      {row.id}: {row.title || (row.id === "WP1" ? "Proje Yönetimi" : "—")}
                    </td>
                    <td className="border border-border p-2 text-right">{formatEur(row.budget)}</td>
                    <td className="border border-border p-2 text-right">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.score}
                        onChange={(e) =>
                          updateWorkPackage(row.id, { qualityScore: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })
                        }
                        className={`${inputClass} w-20 text-right`}
                      />
                    </td>
                    <td className="border border-border p-2 text-right">%{row.paymentPercentage}</td>
                    <td className="border border-border p-2 text-right">{formatEur(row.paymentAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Ağırlıklı Proje Puanı</p>
              <p className="text-lg font-semibold text-foreground">{paymentSimulation.overallScore}</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Toplam Hibenin Ödenecek Oranı</p>
              <p className="text-lg font-semibold text-foreground">%{paymentSimulation.effectivePaymentPercentage}</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Ödenecek Toplam Tutar</p>
              <p className="text-lg font-semibold text-foreground">{formatEur(paymentSimulation.totalPaid)}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {paymentSimulation.overallScoreSufficient
              ? "Proje puanı ≥70 olduğu için indirim yalnızca 70'in altında kalan iş paketlerine uygulanır."
              : "Proje puanı 70'in altında olduğu için indirim tüm hibeye (iş paketi bazında değil) uygulanır."}
          </p>
        </Card>
      </div>
    </div>
  );
}
