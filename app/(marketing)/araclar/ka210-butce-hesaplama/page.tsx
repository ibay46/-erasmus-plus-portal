import { Ka210BudgetCalculator } from "@/components/tools/Ka210BudgetCalculator";

export const metadata = { title: "KA210 Bütçe Hesaplama | Erasmus+ Portal" };

export default function Ka210ButceHesaplamaPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2 text-foreground print:hidden">KA210 Bütçe Hesaplama</h1>
      <p className="text-muted-foreground mb-4 max-w-2xl print:hidden">
        KA210 Küçük Ölçekli Ortaklık hareketliliği için seyahat ve bireysel destek bütçesini hesaplayın.
        Ortak şehrini girdikten sonra <strong className="text-foreground">Hesapla</strong> butonuna basarak
        mesafeyi otomatik hesaplatabilirsiniz (OpenStreetMap verileri, kuş uçuşu).
      </p>
      <p className="text-xs text-muted-foreground mb-8 max-w-2xl print:hidden">
        Rakamlar 2026 Erasmus+ Programme Guide&apos;a göredir ve her yıl değişebilir. Günlük bireysel
        destek tutarı, Ulusal Ajans&apos;ın yayınladığı kesin orana göre aralık içinde elle girilmelidir;
        aralığı aşarsanız sayfa sizi uyarır.
      </p>
      <Ka210BudgetCalculator />
    </div>
  );
}
