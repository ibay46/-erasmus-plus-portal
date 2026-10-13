import { requireTier } from "@/lib/auth";
import { ProjeForm } from "@/components/tools/ProjeForm";
import { createProje } from "@/lib/actions/proje";

export const metadata = { title: "Yeni Proje | Erasmus+ Portal" };

export default async function YeniProjePage() {
  await requireTier("FREE");

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Yeni Proje</h1>
      <p className="text-muted-foreground mb-8">
        Bu bilgiler, ilgili tüm araçlarda otomatik olarak kullanılacak.
      </p>
      <ProjeForm onSubmit={createProje} />
    </div>
  );
}
