import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getCurrentUser, hasTier } from "@/lib/auth";
import { FREE_FEATURES, STANDARD_LINKS, PREMIUM_LINKS } from "@/lib/content/membershipTiers";

export const metadata = {
  title: "Erasmus Akademi | Erasmus+ Portal",
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-accent" aria-hidden="true">
      <circle cx="10" cy="10" r="9" className="fill-accent/15" />
      <path d="M6.5 10.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function AkademiPage() {
  const user = await getCurrentUser();
  const isStandardOrAbove = hasTier(user, "STANDARD");
  const isPremium = hasTier(user, "PREMIUM");

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground">Erasmus Akademi</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Örnek projeler, eğitim içerikleri, kontrol listeleri ve yapay zeka destekli kaynaklarla
        Erasmus+ başvurularınızı güçlendirin.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mb-12">
        <Card className="flex flex-col">
          <h2 className="font-medium text-foreground mb-1">Ücretsiz</h2>
          <p className="text-sm text-muted-foreground mb-4">Herkese açık temel içerikler.</p>
          <ul className="text-sm text-foreground space-y-2.5 flex-1">
            {FREE_FEATURES.map((feature) => (
              <li key={feature.href} className="flex items-start gap-2">
                <CheckIcon />
                <Link href={feature.href} className="cursor-pointer hover:text-accent hover:underline">
                  {feature.label}
                </Link>
              </li>
            ))}
          </ul>
          <span className="mt-5 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground">
            Mevcut Erişiminiz
          </span>
        </Card>

        <Card
          className={`relative flex flex-col border-accent ring-1 ring-accent/30 ${
            isStandardOrAbove ? "bg-accent/[0.04]" : "bg-muted"
          }`}
        >
          <h2 className="font-medium text-foreground mb-1">Standart</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Örnek içerikler ve pratik araçlarla başvurularınızı hazırlayın.
          </p>
          <ul className="text-sm text-foreground space-y-2.5 flex-1">
            {STANDARD_LINKS.map((link) => (
              <li key={link.href} className="flex items-start gap-2">
                <CheckIcon />
                {isStandardOrAbove ? (
                  <Link href={link.href} className="cursor-pointer hover:text-accent hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  link.label
                )}
              </li>
            ))}
          </ul>
          {isStandardOrAbove ? (
            <Link
              href={STANDARD_LINKS[0].href}
              className="cursor-pointer mt-5 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
            >
              İçerikleri Görüntüle
            </Link>
          ) : (
            <Link
              href="/danismanlik/talep"
              className="cursor-pointer mt-5 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
            >
              Üyelik Talebi Gönder
            </Link>
          )}
        </Card>

        <Card className={`flex flex-col ${isPremium ? "border-accent/60" : ""}`}>
          <h2 className="font-medium text-foreground mb-1">Premium</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tüm içerikler + değerlendirme rehberleri, AI promptları ve topluluk erişimi.
          </p>
          <ul className="text-sm text-foreground space-y-2.5 flex-1">
            {PREMIUM_LINKS.map((link) => (
              <li key={link.href} className="flex items-start gap-2">
                <CheckIcon />
                {isPremium ? (
                  <Link href={link.href} className="cursor-pointer hover:text-accent hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  link.label
                )}
              </li>
            ))}
          </ul>
          {isPremium ? (
            <Link
              href={PREMIUM_LINKS[0].href}
              className="cursor-pointer mt-5 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
            >
              İçerikleri Görüntüle
            </Link>
          ) : (
            <Link
              href="/danismanlik/talep"
              className="cursor-pointer mt-5 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
            >
              Üyelik Talebi Gönder
            </Link>
          )}
        </Card>
      </div>

      {!user && (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Standart veya Premium içeriklere erişmek için bir hesap oluşturun.
          </p>
          <Link
            href="/kayit"
            className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Hesap Oluştur
          </Link>
        </div>
      )}

      {user && user.membershipTier === "FREE" && (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Şu anda Ücretsiz üyesiniz. Standart veya Premium üyeliğe yükseltmek için danışmanlık
            ekibimizle iletişime geçin — üyelik yükseltmeleri şu an için elle onaylanmaktadır.
          </p>
          <Link
            href="/danismanlik/talep"
            className="cursor-pointer inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Üyelik Talebi Gönder
          </Link>
        </div>
      )}
    </div>
  );
}
