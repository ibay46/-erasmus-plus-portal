import { notFound } from "next/navigation";
import { Ka220PersonelZamanCizelgesi } from "@/components/tools/Ka220PersonelZamanCizelgesi";
import { isToolPublished, isToolPremium } from "@/lib/toolVisibility";
import { requireTier } from "@/lib/auth";

export const metadata = {
  title: "KA220 Staff Timesheet | Erasmus+ Portal",
  description:
    "Fill in the staff timesheet required for the KA220-SCH 'Project Results' grant item in monthly tables; total days and the amount earned are calculated automatically, and you can download it as Excel.",
};

export default async function EnglishKa220PersonelZamanCizelgesiPage() {
  if (!(await isToolPublished("/araclar/ka220-personel-zaman-cizelgesi"))) notFound();
  if (await isToolPremium("/araclar/ka220-personel-zaman-cizelgesi")) await requireTier("PREMIUM");

  return (
    <div>
      {/* Scoped to this route only: @page margin 0 stops Chrome injecting its own
          date/title/URL header+footer into the margin band. Every printable
          section below (Summary card, each month card) supplies its own 2cm
          print padding instead, since that margin has to repeat per page. */}
      <style dangerouslySetInnerHTML={{ __html: "@media print { @page { margin: 0; } }" }} />
      <div className="print:hidden">
        <h1 className="text-3xl font-semibold mb-2 text-foreground">KA220 Staff Timesheet</h1>
        <p className="text-muted-foreground mb-4 max-w-2xl">
          Under the <strong>&quot;Project Results&quot;</strong> budget item of a KA220-SCH grant
          agreement, the number of days staff spend producing a concrete output (working days × unit
          cost) can be claimed as an entitlement. The supporting document required for this is a
          timesheet showing which day each staff member worked on which output.
        </p>
        <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
          <strong>The daily unit cost is not set by your institution</strong> — it must be taken from
          the &quot;Annex IV: Applicable Rates&quot; section of your grant agreement, or the Annex III
          (Unit Costs) table of the Erasmus+ Programme Guide for the relevant call year, based on the
          country + staff category combination. This tool only facilitates the days × unit cost
          calculation and documentation.
        </p>
      </div>
      <Ka220PersonelZamanCizelgesi locale="en" />
    </div>
  );
}
