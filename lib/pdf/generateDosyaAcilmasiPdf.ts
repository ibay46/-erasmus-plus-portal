import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { workSansRegularBase64, workSansBoldBase64 } from "./workSansFont";

const PAGE_WIDTH = 210;
const MARGIN_X = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

export interface DosyaAcilmasiPdfData {
  programAdi: string;
  yil: string;
  anaEylem: string;
  cagriDonemi: string;
  ulusalAjansSunulan: string;
  projeNumarasi: string;
  projeAdi: string;
  ekSayfaSayisi: string;

  tabloBasligi: string;
  programEylemTuru: string;
  basvuruCagrisi: string;
  koordinatorUlkeKurum: string;
  turkiyeOrtagiKurum: string;
  ulusalAjansKoordinator: string;
  projeBaslamaTarihiLabel: string;
  projeBitisTarihiLabel: string;
  projeSuresi: string;
  toplamProjeButcesi: string;
  turkiyeyeAitButce: string;
  turkiyeProjeYurutucusu: string;
  projeYurutucusuTelefon: string;
  projeYurutucusuEposta: string;
  toplamOrtakSayisi: string;
  ortakUlkeler: string;
  toplamUluslararasiHareketlilik: string;
  hareketlilikTuru: string;
  yerelFaaliyetler: string;
  hedefYasGrubu: string;
  hedefGruplar: string;
  projeOncelikleri: string;
  temelCiktilar: string;
  yayginlastirmaAraclari: string;
  muhasebeDayanagi: string;
}

function registerFont(doc: jsPDF) {
  doc.addFileToVFS("WorkSans-Regular.ttf", workSansRegularBase64);
  doc.addFont("WorkSans-Regular.ttf", "WorkSans", "normal");
  doc.addFileToVFS("WorkSans-Bold.ttf", workSansBoldBase64);
  doc.addFont("WorkSans-Bold.ttf", "WorkSans", "bold");
  doc.setFont("WorkSans", "normal");
}

function field(value: string, fallback = "…."): string {
  return value || fallback;
}

export function generateDosyaAcilmasiPdf(data: DosyaAcilmasiPdfData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  registerFont(doc);

  let cursorY = 20;

  const paragraph1 =
    `Dışişleri Bakanlığı Avrupa Birliği Eğitim ve Gençlik Programları Merkezi Başkanlığı tarafından ` +
    `yürütülmekte olan Erasmus+ ${field(data.programAdi, "…. Programı")} kapsamında, ${field(data.yil, "….")} Yılı ` +
    `Ana Eylem ${field(data.anaEylem)} faaliyeti çerçevesinde, ${field(data.cagriDonemi)} çağrı döneminde ` +
    `${field(data.ulusalAjansSunulan)} Ulusal Ajansına sunulan ${field(data.projeNumarasi)} numaralı ve ` +
    `“${field(data.projeAdi)}” başlıklı proje teklifimiz kabul edilmiştir.`;

  const paragraph2 =
    `Bu kapsamda, projemize ait hibe işlemlerinin mevzuata uygun şekilde yürütülebilmesi amacıyla; ` +
    `“Avrupa Birliği ve Uluslararası Kuruluşların Kaynaklarından Kamu İdarelerine Proje Karşılığı Aktarılan ` +
    `Hibe Tutarlarının Harcanması ve Muhasebeleştirilmesine İlişkin Yönetmelik” hükümleri doğrultusunda, söz ` +
    `konusu projeye ilişkin aşağıda ayrıntılı bilgileri yer alan proje dosyasının açılması gerekmektedir.`;

  doc.setFont("WorkSans", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(20);

  for (const paragraph of [paragraph1, paragraph2]) {
    const lines = doc.splitTextToSize(paragraph, CONTENT_WIDTH);
    doc.text(lines, MARGIN_X, cursorY);
    cursorY += lines.length * 5 + 4;
  }

  doc.text("Gereğini arz ederim.", MARGIN_X, cursorY);
  cursorY += 10;

  doc.setFont("WorkSans", "bold");
  doc.text("Ek:", MARGIN_X, cursorY);
  doc.setFont("WorkSans", "normal");
  doc.text(`Proje Sözleşmesi (${field(data.ekSayfaSayisi, "….")} sayfa)`, MARGIN_X + 8, cursorY);
  cursorY += 10;

  doc.setFont("WorkSans", "bold");
  doc.setFontSize(11);
  doc.text(`Erasmus+ ${field(data.tabloBasligi, "")} Proje Bilgi Tablosu`.replace("  ", " "), MARGIN_X, cursorY);
  cursorY += 4;

  const rows: [string, string][] = [
    ["Proje Adı", data.projeAdi],
    ["Proje Numarası", data.projeNumarasi],
    ["Program / Eylem Türü", data.programEylemTuru],
    ["Başvuru Çağrısı", data.basvuruCagrisi],
    ["Koordinatör Ülke / Kurum", data.koordinatorUlkeKurum],
    ["Türkiye Ortağı Kurum", data.turkiyeOrtagiKurum],
    ["Ulusal Ajans (Koordinatör)", data.ulusalAjansKoordinator],
    ["Proje Başlama Tarihi", data.projeBaslamaTarihiLabel],
    ["Proje Bitiş Tarihi", data.projeBitisTarihiLabel],
    ["Proje Süresi", data.projeSuresi],
    ["Toplam Proje Bütçesi", data.toplamProjeButcesi],
    ["Türkiye'ye Ait Bütçe", data.turkiyeyeAitButce],
    ["Türkiye Proje Yürütücüsü", data.turkiyeProjeYurutucusu],
    ["Proje Yürütücüsü Telefon", data.projeYurutucusuTelefon],
    ["Proje Yürütücüsü E-posta", data.projeYurutucusuEposta],
    ["Toplam Ortak Sayısı", data.toplamOrtakSayisi],
    ["Ortak Ülkeler", data.ortakUlkeler],
    ["Toplam Uluslararası Hareketlilik", data.toplamUluslararasiHareketlilik],
    ["Hareketlilik Türü", data.hareketlilikTuru],
    ["Yerel Faaliyetler", data.yerelFaaliyetler],
    ["Hedef Yaş Grubu", data.hedefYasGrubu],
    ["Hedef Gruplar", data.hedefGruplar],
    ["Proje Öncelikleri", data.projeOncelikleri],
    ["Temel Çıktılar", data.temelCiktilar],
    ["Yaygınlaştırma Araçları", data.yayginlastirmaAraclari],
    ["Muhasebe Dayanağı", data.muhasebeDayanagi],
  ];

  autoTable(doc, {
    startY: cursorY,
    margin: { left: MARGIN_X, right: MARGIN_X },
    tableWidth: CONTENT_WIDTH,
    theme: "plain",
    styles: {
      font: "WorkSans",
      fontSize: 9,
      cellPadding: 2.2,
      lineColor: [200, 200, 200] as [number, number, number],
      lineWidth: 0.2,
      textColor: 20,
    },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: "bold" as const, textColor: 60 },
      1: { cellWidth: "auto" },
    },
    body: rows.map(([label, value]) => [label, field(value, "—")]),
  });

  doc.save("proje-dosyasi-acilmasi.pdf");
}
