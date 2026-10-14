import { requireTier } from "@/lib/auth";
import { ProjeForm } from "@/components/tools/ProjeForm";
import { createProje } from "@/lib/actions/proje";
import type { ProjeIdentityInput } from "@/lib/actions/proje";

export const metadata = { title: "New Project | Erasmus+ Portal" };

export default async function EnglishYeniProjePage() {
  await requireTier("FREE");

  async function handleCreate(input: ProjeIdentityInput) {
    "use server";
    await createProje(input);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-2 text-foreground">New Project</h1>
      <p className="text-muted-foreground mb-8">
        This information will be used automatically across all related tools.
      </p>
      <ProjeForm onSubmit={handleCreate} locale="en" />
    </div>
  );
}
