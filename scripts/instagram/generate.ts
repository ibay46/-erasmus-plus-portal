import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { landmarkSvg, type Country } from "./landmarks";

interface PostInput {
  outputName: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  grad1: string;
  grad2: string;
  grad3: string;
  blob1: string;
  blob2: string;
  badgeColor: string;
}

async function renderPost(input: PostInput) {
  const templatePath = path.join(__dirname, "template.html");
  const logoPath = path.join(__dirname, "..", "..", "public", "logo-icon.png");
  const logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;

  const country = input.date.split(" · ")[0] as Country;

  let html = fs.readFileSync(templatePath, "utf-8");
  html = html
    .replace("{{LOGO}}", logoBase64)
    .replace("{{CATEGORY}}", input.category.toUpperCase())
    .replace("{{TITLE}}", input.title)
    .replace("{{EXCERPT}}", input.excerpt)
    .replace("{{DATE}}", input.date)
    .replace(/{{LANDMARK_SVG}}/g, landmarkSvg(country))
    .replace("{{BADGE_COLOR}}", input.badgeColor);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  await page.setContent(html, { waitUntil: "networkidle" });

  const outDir = path.join(__dirname, "..", "..", "instagram-output");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${input.outputName}.png`);
  await page.screenshot({ path: outPath });
  await browser.close();

  console.log("Oluşturuldu:", outPath);
}

const posts: PostInput[] = [
  {
    outputName: "proje-sonucu-si-ka210adu",
    category: "Proje Sonucu",
    title: "Slovenya 2026 KA210-ADU Proje Sonuçları",
    excerpt: "2 proje onaylandı, toplam 120.000 € hibe.",
    date: "Slovenya · 2026",
    grad1: "#11141c", grad2: "#1a2440", grad3: "#161a24",
    blob1: "#4c7df0", blob2: "#7c5cf0", badgeColor: "#4c5ef0",
  },
  {
    outputName: "proje-sonucu-si-ka210sch",
    category: "Proje Sonucu",
    title: "Slovenya 2026 KA210-SCH Proje Sonuçları",
    excerpt: "30 başvurudan 5 proje onaylandı, toplam 270.000 € hibe.",
    date: "Slovenya · 2026",
    grad1: "#0e1a18", grad2: "#163029", grad3: "#101816",
    blob1: "#2dd4bf", blob2: "#34d399", badgeColor: "#0d9488",
  },
  {
    outputName: "proje-sonucu-si-ka210vet",
    category: "Proje Sonucu",
    title: "Slovenya 2026 KA210-VET Proje Sonuçları",
    excerpt: "3 proje onaylandı, toplam 150.000 € hibe.",
    date: "Slovenya · 2026",
    grad1: "#1a1124", grad2: "#2b1a40", grad3: "#180f20",
    blob1: "#9b5cf6", blob2: "#c084fc", badgeColor: "#8b5cf6",
  },
  {
    outputName: "proje-sonucu-si-ka220adu",
    category: "Proje Sonucu",
    title: "Slovenya 2026 KA220-ADU Proje Sonuçları",
    excerpt: "2 proje onaylandı, toplam 500.000 € hibe.",
    date: "Slovenya · 2026",
    grad1: "#221408", grad2: "#3a2410", grad3: "#1c1208",
    blob1: "#f59e0b", blob2: "#fb923c", badgeColor: "#d97706",
  },
  {
    outputName: "proje-sonucu-si-ka220hed",
    category: "Proje Sonucu",
    title: "Slovenya 2026 KA220-HED Proje Sonuçları",
    excerpt: "2 proje onaylandı, toplam 800.000 € hibe.",
    date: "Slovenya · 2026",
    grad1: "#220c16", grad2: "#3a1428", grad3: "#1c0c14",
    blob1: "#f43f5e", blob2: "#ec4899", badgeColor: "#e11d48",
  },
  {
    outputName: "proje-sonucu-si-ka220sch",
    category: "Proje Sonucu",
    title: "Slovenya 2026 KA220-SCH Proje Sonuçları",
    excerpt: "3 proje onaylandı, toplam 620.000 € hibe.",
    date: "Slovenya · 2026",
    grad1: "#07181c", grad2: "#0f2e36", grad3: "#081418",
    blob1: "#06b6d4", blob2: "#22d3ee", badgeColor: "#0891b2",
  },
  {
    outputName: "proje-sonucu-si-ka220vet",
    category: "Proje Sonucu",
    title: "Slovenya 2026 KA220-VET Proje Sonuçları",
    excerpt: "3 proje onaylandı, toplam 750.000 € hibe.",
    date: "Slovenya · 2026",
    grad1: "#10180a", grad2: "#1f2e12", grad3: "#0c1408",
    blob1: "#84cc16", blob2: "#4ade80", badgeColor: "#65a30d",
  },
  {
    outputName: "proje-sonucu-se-ka210adu",
    category: "Proje Sonucu",
    title: "İsveç 2026 KA210-ADU Proje Sonuçları",
    excerpt: "8 proje onaylandı, toplam 480.000 € hibe.",
    date: "İsveç · 2026",
    grad1: "#1c0a1c", grad2: "#3a1438", grad3: "#180a18",
    blob1: "#d946ef", blob2: "#f472b6", badgeColor: "#c026d3",
  },
  {
    outputName: "proje-sonucu-se-ka210sch",
    category: "Proje Sonucu",
    title: "İsveç 2026 KA210-SCH Proje Sonuçları",
    excerpt: "12 proje onaylandı, toplam 600.000 € hibe.",
    date: "İsveç · 2026",
    grad1: "#1c120a", grad2: "#3a2414", grad3: "#180e08",
    blob1: "#b45309", blob2: "#ea580c", badgeColor: "#92400e",
  },
  {
    outputName: "proje-sonucu-se-ka210vet",
    category: "Proje Sonucu",
    title: "İsveç 2026 KA210-VET Proje Sonuçları",
    excerpt: "5 proje onaylandı, toplam 270.000 € hibe.",
    date: "İsveç · 2026",
    grad1: "#0e1318", grad2: "#1c2a36", grad3: "#0c1216",
    blob1: "#64748b", blob2: "#94a3b8", badgeColor: "#475569",
  },
  {
    outputName: "proje-sonucu-se-ka220adu",
    category: "Proje Sonucu",
    title: "İsveç 2026 KA220-ADU Proje Sonuçları",
    excerpt: "5 proje onaylandı, toplam 1.550.000 € hibe.",
    date: "İsveç · 2026",
    grad1: "#1c1608", grad2: "#3a2e10", grad3: "#181206",
    blob1: "#eab308", blob2: "#facc15", badgeColor: "#ca8a04",
  },
  {
    outputName: "proje-sonucu-se-ka220hed",
    category: "Proje Sonucu",
    title: "İsveç 2026 KA220-HED Proje Sonuçları",
    excerpt: "5 proje onaylandı, toplam 1.850.000 € hibe.",
    date: "İsveç · 2026",
    grad1: "#1c0a0e", grad2: "#3a141c", grad3: "#180810",
    blob1: "#9f1239", blob2: "#be123c", badgeColor: "#881337",
  },
  {
    outputName: "proje-sonucu-se-ka220sch",
    category: "Proje Sonucu",
    title: "İsveç 2026 KA220-SCH Proje Sonuçları",
    excerpt: "6 proje onaylandı, toplam 1.800.000 € hibe.",
    date: "İsveç · 2026",
    grad1: "#081420", grad2: "#0f2840", grad3: "#06101a",
    blob1: "#0ea5e9", blob2: "#38bdf8", badgeColor: "#0369a1",
  },
  {
    outputName: "proje-sonucu-se-ka220vet",
    category: "Proje Sonucu",
    title: "İsveç 2026 KA220-VET Proje Sonuçları",
    excerpt: "5 proje onaylandı, toplam 1.700.000 € hibe.",
    date: "İsveç · 2026",
    grad1: "#160a1c", grad2: "#2c1438", grad3: "#120818",
    blob1: "#a855f7", blob2: "#d8b4fe", badgeColor: "#7e22ce",
  },
  {
    outputName: "proje-sonucu-se-ka240sch",
    category: "Proje Sonucu",
    title: "İsveç 2026 KA240-SCH Proje Sonucu",
    excerpt: "1 proje onaylandı, 400.000 € hibe.",
    date: "İsveç · 2026",
    grad1: "#1c0a0a", grad2: "#3a1414", grad3: "#180808",
    blob1: "#dc2626", blob2: "#1d4ed8", badgeColor: "#dc2626",
  },
  {
    outputName: "proje-sonucu-fi-ka220sch",
    category: "Proje Sonucu",
    title: "Finlandiya 2026 KA220-SCH Proje Sonuçları",
    excerpt: "5 proje onaylandı, her biri 250.000 € — toplam 1.250.000 € hibe.",
    date: "Finlandiya · 2026",
    grad1: "#11141c", grad2: "#1a2440", grad3: "#161a24",
    blob1: "#4c7df0", blob2: "#7c5cf0", badgeColor: "#4c5ef0",
  },
  {
    outputName: "proje-sonucu-fi-ka210sch",
    category: "Proje Sonucu",
    title: "Finlandiya 2026 KA210-SCH Proje Sonuçları",
    excerpt: "10 proje onaylandı, toplam 570.000 € hibe.",
    date: "Finlandiya · 2026",
    grad1: "#0e1a18", grad2: "#163029", grad3: "#101816",
    blob1: "#2dd4bf", blob2: "#34d399", badgeColor: "#0d9488",
  },
  {
    outputName: "proje-sonucu-fi-ka240sch",
    category: "Proje Sonucu",
    title: "Finlandiya 2026 KA240-SCH Proje Sonuçları",
    excerpt: "1 proje onaylandı, 400.000 € hibe.",
    date: "Finlandiya · 2026",
    grad1: "#1a1124", grad2: "#2b1a40", grad3: "#180f20",
    blob1: "#9b5cf6", blob2: "#c084fc", badgeColor: "#8b5cf6",
  },
  {
    outputName: "proje-sonucu-fi-ka210adu",
    category: "Proje Sonucu",
    title: "Finlandiya 2026 KA210-ADU Proje Sonuçları",
    excerpt: "7 proje onaylandı, toplam 390.000 € hibe.",
    date: "Finlandiya · 2026",
    grad1: "#221408", grad2: "#3a2410", grad3: "#1c1208",
    blob1: "#f59e0b", blob2: "#fb923c", badgeColor: "#d97706",
  },
  {
    outputName: "proje-sonucu-fi-ka220adu",
    category: "Proje Sonucu",
    title: "Finlandiya 2026 KA220-ADU Proje Sonuçları",
    excerpt: "5 proje onaylandı, toplam 990.000 € hibe.",
    date: "Finlandiya · 2026",
    grad1: "#220c16", grad2: "#3a1428", grad3: "#1c0c14",
    blob1: "#f43f5e", blob2: "#ec4899", badgeColor: "#e11d48",
  },
  {
    outputName: "proje-sonucu-cz-ka210sch-1",
    category: "Proje Sonucu",
    title: "Çek Cumhuriyeti 2026 KA210-SCH Proje Sonuçları",
    excerpt: "1. liste: 10 proje kesin onaylandı.",
    date: "Çek Cumhuriyeti · 2026",
    grad1: "#1c0a0a", grad2: "#3a1414", grad3: "#180808",
    blob1: "#dc2626", blob2: "#1d4ed8", badgeColor: "#dc2626",
  },
  {
    outputName: "proje-sonucu-cz-ka220sch",
    category: "Proje Sonucu",
    title: "Çek Cumhuriyeti 2026 KA220-SCH Proje Sonuçları",
    excerpt: "6 proje kesin onaylandı.",
    date: "Çek Cumhuriyeti · 2026",
    grad1: "#0a1020", grad2: "#142848", grad3: "#0a0e18",
    blob1: "#2563eb", blob2: "#dc2626", badgeColor: "#2563eb",
  },
  {
    outputName: "proje-sonucu-at-ka240sch",
    category: "Proje Sonucu",
    title: "Avusturya 2026 KA240-SCH Proje Sonuçları",
    excerpt: "2 proje onaylandı, toplam 800.000 € hibe.",
    date: "Avusturya · 2026",
    grad1: "#13123a", grad2: "#211f5e", grad3: "#100f30",
    blob1: "#4338ca", blob2: "#818cf8", badgeColor: "#4338ca",
  },
  {
    outputName: "proje-sonucu-at-ka220sch",
    category: "Proje Sonucu",
    title: "Avusturya 2026 KA220-SCH Proje Sonuçları",
    excerpt: "3 proje onaylandı, toplam 1.200.000 € hibe.",
    date: "Avusturya · 2026",
    grad1: "#241606", grad2: "#3a2410", grad3: "#1c1004",
    blob1: "#b45309", blob2: "#fbbf24", badgeColor: "#b45309",
  },
  {
    outputName: "proje-sonucu-at-ka210sch",
    category: "Proje Sonucu",
    title: "Avusturya 2026 KA210-SCH Proje Sonuçları",
    excerpt: "5 proje onaylandı, toplam 300.000 € hibe.",
    date: "Avusturya · 2026",
    grad1: "#260808", grad2: "#3a1010", grad3: "#1c0606",
    blob1: "#b91c1c", blob2: "#ef4444", badgeColor: "#b91c1c",
  },
];

(async () => {
  for (const post of posts) {
    await renderPost(post);
  }
})();
