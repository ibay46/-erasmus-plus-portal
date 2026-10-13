import { notFound } from "next/navigation";
import Link from "next/link";
import { requireTier } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ProjeForm } from "@/components/tools/ProjeForm";
import { updateProje } from "@/lib/actions/proje";
import { projeToFormInput } from "@/lib/projeMapping";

export const metadata = { title: "Proje Detayı | Erasmus+ Portal" };

const LINKED_TOOLS = [
  { slug: "proje-sozlesmesi", title: "Proje Ortaklık Sözleşmesi" },
  { slug: "proje-dosyasi-acilmasi", title: "Proje Dosyası Açılması Dilekçesi" },
  { slug: "meb-ppts-proje-formu", title: "MEB PPTS Formu" },
  { slug: "yolluk-bildirimi", title: "Geçici Görev Yolluğu Bildirimi" },
  { slug: "on-mali-kontrol-listesi", title: "Ön Malî Kontrol Listesi" },
  { slug: "avans-harcama-formu", title: "AB Hibe Proje Avans Harcama Formu" },
];

export default async function ProjeDetayPage({
  params,
}: {
  params: Promise<{ projeId: string }>;
}) {
  const { projeId } = await params;
  const user = await requireTier("FREE");

  const proje = await prisma.proje.findUnique({ where: { id: projeId } });
  if (!proje || proje.userId !== user.id) notFound();

  async function handleUpdate(input: Parameters<typeof updateProje>[1]) {
    "use server";
    await updateProje(projeId, input);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-2 text-foreground">{proje.title}</h1>
      <p className="text-muted-foreground mb-8">
        Bu bilgileri güncelleyin, ardından aşağıdaki araçlardan istediğinizi açın — hepsi bu proje
        için otomatik dolar.
      </p>

      <Card className="mb-8 border-accent/40">
        <h2 className="mb-3 font-medium text-foreground">Araçlar</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {LINKED_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/araclar/${tool.slug}?proje=${proje.id}`}
              className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm text-foreground transition-colors duration-200 hover:border-accent/50 hover:text-accent"
            >
              {tool.title}
            </Link>
          ))}
        </div>
      </Card>

      <ProjeForm initialValues={projeToFormInput(proje)} onSubmit={handleUpdate} />
    </div>
  );
}
