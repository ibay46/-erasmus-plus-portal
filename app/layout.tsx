import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { PageViewTracker } from "@/components/layout/PageViewTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <PageViewTracker />
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
