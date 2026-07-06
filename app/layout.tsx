import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { HeaderHeightSync } from "@/components/layout/HeaderHeightSync";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { PageViewTracker } from "@/components/layout/PageViewTracker";
import { getAnnouncement } from "@/lib/announcement";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "Türkiye'deki Erasmus+ proje yazan öğretmenler, okullar, belediyeler ve STK'lar için haberler, rehberler, araçlar ve danışmanlık.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.erasmusportal.com"),
  title: "Erasmus+ Portal",
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Erasmus+ Portal",
    title: "Erasmus+ Portal",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Erasmus+ Portal",
    description: SITE_DESCRIPTION,
  },
  verification: {
    google: "oRGdlsgqPLjcmMawl7u0hYdGPiT56kKqWW4vlxbpr-A",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const announcement = isAdmin ? null : await getAnnouncement();

  return (
    <html lang="tr" className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <PageViewTracker />
          {isAdmin ? (
            children
          ) : (
            <>
              <div id="site-header" className="fixed inset-x-0 top-0 z-50">
                {announcement?.enabled && (
                  <AnnouncementBanner
                    message={announcement.message}
                    linkHref={announcement.linkHref}
                    linkLabel={announcement.linkLabel}
                    version={announcement.updatedAt.toISOString()}
                  />
                )}
                <Header />
              </div>
              <HeaderHeightSync />
              <main className="min-w-0 flex-1" style={{ paddingTop: "var(--header-h, 6.5rem)" }}>
                {children}
              </main>
              <Footer />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
