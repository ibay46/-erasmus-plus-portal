// Erasmus+ 2024+ dönemi yatay ve sektörel öncelikleri (tam liste).
// "Proje Fikri Geliştirme Sihirbazı"nın Öncelikler adımında kullanılır.
// Not: lib/content/erasmusPriorities.ts yalnızca KA210/Okul Eğitimi'ne özel,
// tema eşleştirme mantığı içeren ayrı bir modüldür; bu dosya onun yerine geçmez,
// sihirbaz için sade ve tüm sektörleri kapsayan referans listesidir.

export const HORIZONTAL_PRIORITIES_FULL: string[] = [
  "Dijital dönüşüm: dijital hazırlık, dayanıklılık ve kapasitenin geliştirilmesi",
  "Ortak değerler, sivil katılım ve vatandaşlık bilinci",
  "Çevre ve iklim değişikliğiyle mücadele",
  "Eğitim, öğretim, gençlik ve spor alanlarının tamamında kapsayıcılık ve çeşitlilik",
];

export type EducationSectorCode = "SCH" | "VET" | "ADU" | "YOU" | "HED";

export const SECTORAL_PRIORITIES_FULL: Record<EducationSectorCode, string[]> = {
  YOU: [
    "Gençlik çalışmalarının kalitesinin, yeniliğinin ve tanınırlığının artırılması",
    "Aktif vatandaşlığın, gençlerin girişimcilik ruhunun ve sosyal girişimcilik dahil gençlik girişimciliğinin desteklenmesi",
    "Politika, araştırma ve uygulama arasındaki bağların güçlendirilmesi",
    "Gençlerin istihdam edilebilirliğinin güçlendirilmesi",
  ],
  ADU: [
    "Yetişkin eğitimine erişimi kolaylaştıran ve katılımı artıran beceri geliştirme yollarının oluşturulması",
    "Geleceğe dönük öğrenme merkezlerinin geliştirilmesi",
    "Yetişkin eğitiminde kalite güvencesinin güçlendirilmesi",
    "Yetişkinler için yüksek kaliteli öğrenme fırsatlarının erişilebilirliğinin artırılması",
    "Eğitimcilerin ve diğer yetişkin eğitimi personelinin yetkinliklerinin geliştirilmesi",
  ],
  HED: [
    "Kapsayıcı yükseköğretim sistemlerinin oluşturulması",
    "Yükseköğretimde STEM/STEAM'in, özellikle kadınların STEM alanlarındaki katılımının geliştirilmesi",
    "Birbirine bağlı yükseköğretim sistemlerinin teşvik edilmesi",
    "Öğrenme, öğretme ve beceri geliştirmede mükemmelliğin ödüllendirilmesi",
    "Yenilikçi öğrenme ve öğretme uygulamalarının teşvik edilmesi",
    "Yükseköğretim sektörünün dijital kapasitesinin desteklenmesi",
  ],
  SCH: [
    "Temel yetkinliklerin geliştirilmesi",
    "Öğretmenlerin, okul liderlerinin ve diğer eğitim meslek gruplarının desteklenmesi",
    "Yüksek kaliteli erken çocukluk eğitimi ve bakım sistemlerinin geliştirilmesi",
    "Dil öğrenimi ve öğretimine kapsamlı bir yaklaşımın teşvik edilmesi",
    "Fen, teknoloji, mühendislik ve matematiğe (STEM) ilgi ve mükemmelliğin teşvik edilmesi",
    "Sınır ötesi öğrenme hareketliliğine katılan öğrencilerin öğrenim kazanımlarının tanınması",
    "Öğrenme dezavantajlarının, erken okul terkinin ve temel becerilerdeki yetersizliğin ele alınması",
  ],
  VET: [
    "Mesleki eğitim ve öğretimin işgücü piyasası ihtiyaçlarına uyarlanması",
    "Mesleki eğitim ve öğretimde yeniliğe katkı sağlanması",
    "Mesleki eğitim ve öğretim sağlayıcıları için uluslararasılaşma stratejilerinin oluşturulması ve uygulanması",
    "Mesleki eğitim ve öğretimde kalite güvencesinin geliştirilmesi",
    "Mesleki eğitim ve öğretimin cazibesinin artırılması",
    "Mesleki eğitim ve öğretimdeki fırsatların esnekliğinin artırılması",
  ],
};
