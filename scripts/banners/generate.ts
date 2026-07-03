import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { landmarkSvg, type Country } from "../instagram/landmarks";

const COUNTRIES: Country[] = ["Finlandiya", "İsveç", "Slovenya", "Çek Cumhuriyeti", "Avusturya", "Yunanistan"];

async function renderBanner(country: Country) {
  const templatePath = path.join(__dirname, "template.html");
  let html = fs.readFileSync(templatePath, "utf-8");
  html = html.replace(/{{LANDMARK_SVG}}/g, landmarkSvg(country));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "networkidle" });

  const outDir = path.join(__dirname, "..", "..", "banner-output");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${country}.png`);
  await page.screenshot({ path: outPath });
  await browser.close();

  console.log("Oluşturuldu:", outPath);
}

(async () => {
  for (const country of COUNTRIES) {
    await renderBanner(country);
  }
})();
