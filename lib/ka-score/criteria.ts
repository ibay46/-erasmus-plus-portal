// Kaynak: Guide for Experts on Quality Assessment 2026, KA210 bölümü (s. 58-64)
// Form sorusu → kriter eşlemesi: resmi başvuru formundaki bölüm ve alan adları
// NOTE: `formQuestions[].text` is the official EU application-form wording, already in
// English, so it is shared by both locales as-is. The *En fields below hold the English
// translations of the Turkish editorial commentary (labels, descriptions, tips, notes).

export type CriterionId = "relevance" | "design" | "partnership" | "impact";

export interface FormQuestion {
  text: string;
  note?: string;
  noteEn?: string;
}

export interface Element {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  tip: string;
  tipEn: string;
  formQuestions: FormQuestion[];
}

export interface Criterion {
  id: CriterionId;
  label: string;
  labelEn: string;
  maxScore: number;
  threshold: number;
  elements: Element[];
  criticalNote?: string;
  criticalNoteEn?: string;
}

export const CRITERIA: Criterion[] = [
  // ─────────────────────────────────────────────────────────────────────
  // 1. RELEVANCE / Uygunluk — 30 puan, eşik 15
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "relevance",
    label: "Uygunluk",
    labelEn: "Relevance of the project",
    maxScore: 30,
    threshold: 15,
    criticalNote:
      "Teklif en az bir önceliğe ikna edici uyum kanıtı sunmuyorsa değerlendirici bu kriteri Zayıf (0-14) puanlamak ZORUNDADIR → proje otomatik reddedilir.",
    criticalNoteEn:
      "If the proposal does not provide convincing evidence of alignment with at least one priority, the evaluator MUST score this criterion as Poor (0-14) → the project is automatically rejected.",
    elements: [
      {
        id: "rel-a",
        label: "a) Eylem Hedefleri ve Önceliklere Uygunluk",
        labelEn: "a) Alignment with Action Objectives and Priorities",
        description:
          "Proje, Programme Guide'daki eylem hedeflerine atıfta bulunuyor ve en az bir yatay veya alana özgü önceliği nitelikli şekilde ele alıyor. Sadece öncelik adını listelemek yetmez — değerlendirici somut bağlantı arar.",
        descriptionEn:
          "The project refers to the action objectives in the Programme Guide and substantively addresses at least one horizontal or field-specific priority. Simply listing the priority's name is not enough — the evaluator looks for a concrete link.",
        tip: "Her seçilen öncelik için 'Bu önceliği şu aktivite/çıktı ile ele alıyoruz:' cümlesi yazın. Deklaratif ifadeler ('katkı sağlayacak') somut kanıt sayılmaz.",
        tipEn:
          "For each priority you select, write a sentence such as 'We address this priority through the following activity/output:'. Declarative statements (e.g. 'will contribute to') do not count as concrete evidence.",
        formQuestions: [
          {
            text: "Please select the most relevant priority according to the objectives of your project.",
          },
          {
            text: "If relevant, please select up to two additional priorities according to the objectives of your project.",
          },
          {
            text: "Please select up to three topics addressed by your project.",
          },
          {
            text: "What are the concrete objectives you would like to achieve and outcomes or results you would like to realise? How are these objectives linked to the priorities you have selected?",
            note: "Sorunun 'Bu hedefler seçilen önceliklerle nasıl bağlantılı?' kısmı bu unsurun ana kanıtıdır.",
            noteEn:
              "The 'How are these objectives linked to the priorities you have selected?' part of this question is the main evidence for this element.",
          },
          {
            text: "Please describe the motivation for your project and explain why it should be funded.",
          },
        ],
      },
      {
        id: "rel-b",
        label: "b) AB Değerlerine Uygunluk",
        labelEn: "b) Alignment with EU Values",
        description:
          "AB değerleri proje hedeflerine, metodolojisine, faaliyetlerine ve beklenen çıktılarına açıkça entegre edilmiş. Faaliyetler ayrımcılık yapmayan yaklaşımla tasarlanmış; cinsiyet dengesi ve eşit erişim stratejisi içeriyor.",
        descriptionEn:
          "EU values are clearly integrated into the project's objectives, methodology, activities and expected outputs. Activities are designed with a non-discriminatory approach and include a strategy for gender balance and equal access.",
        tip: "Bu unsurun doğrudan karşılığı olan açık uçlu bir soru yoktur. Değerlendirici kanıtı aşağıdaki sorulardan toplar — özellikle 'Yatay boyutlar' sorusunun Kapsayıcılık ve Çeşitlilik kısmında AB değerlerine açık atıf yapın.",
        tipEn:
          "There is no single open-ended question that directly corresponds to this element. The evaluator gathers evidence from the questions below — make an explicit reference to EU values, especially in the Inclusion and Diversity part of the 'horizontal aspects' question.",
        formQuestions: [
          {
            text: "I confirm that I, my organisation and the co-beneficiaries adhere to the EU values mentioned in Article 2 of the TEU and Article 21 of the EU Charter of Fundamental Rights.",
            note: "Onay kutusu — Application conditions → EU values bölümü.",
            noteEn: "Tick box — Application conditions → EU values section.",
          },
          {
            text: "I understand and agree that EU values will be used as part of the criteria for evaluation of the activities implemented under this project.",
            note: "Onay kutusu.",
            noteEn: "Tick box.",
          },
          {
            text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
            note: "Özellikle 'Inclusion and Diversity' kısmındaki ayrımcılık karşıtı önlemler, cinsiyet dengesi ve eşit katılım ifadeleri.",
            noteEn:
              "Especially the anti-discrimination measures, gender balance and equal-participation statements in the 'Inclusion and Diversity' part.",
          },
          {
            text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
            note: "Her faaliyette tekrar eden soru — dezavantajlı gruplara öncelik ve eşit erişim ifadeleri buraya yazılmalı.",
            noteEn:
              "A recurring question for each activity — statements on prioritising disadvantaged groups and equal access should be written here.",
          },
        ],
      },
      {
        id: "rel-c",
        label: "c) Katılımcı Kuruluşların Profil ve Deneyim Uygunluğu",
        labelEn: "c) Relevance of the Participating Organisations' Profile and Experience",
        description:
          "Kuruluşlar başvurulan alanın gerçek bir parçası; bu, personel uzmanlığı ve önceki deneyimle kanıtlanmış pratik ilgidir. Az deneyimli ortaklar için projeye özgün katkı somut yazılmalıdır.",
        descriptionEn:
          "The organisations are genuinely active in the field applied for; this is a practical relevance evidenced by staff expertise and prior experience. For less experienced partners, their specific contribution to the project must be written concretely.",
        tip: "Her ortak için 'Bu kurumun bu projede vazgeçilmez olmasının nedeni:' sorusunu yanıtlayın. Genel beyanlar yerine spesifik uzmanlık veya hedef gruba erişim bilgisi yazın.",
        tipEn:
          "For each partner, answer the question 'Why is this organisation indispensable to this project?'. Write specific expertise or access to the target group rather than general statements.",
        formQuestions: [
          {
            text: "What are the organisation's main activities?",
            note: "Başvuran ve her ortak kuruluş için ayrı ayrı doldurulur.",
            noteEn: "Filled in separately for the applicant and each partner organisation.",
          },
          {
            text: "What are the organisation's activities in the field of this application?",
          },
          {
            text: "What profiles and age groups of learners are concerned by the organisation's work?",
          },
          {
            text: "How many years of experience does the organisation have working in the field of this application?",
          },
          {
            text: "Would you like to make any comments or add any information to the summary of your organisation's past participation?",
          },
          {
            text: "Past participation table: Number of project applications / Number of granted projects (as Applicant and as Partner).",
            note: "Tablo otomatik dolar — değerlendirici bu verileri kullanarak newcomer/less experienced tanımını uygular.",
            noteEn:
              "The table fills in automatically — the evaluator uses this data to apply the newcomer/less-experienced definition.",
          },
        ],
      },
      {
        id: "rel-d",
        label: "d) AB Düzeyinde Katma Değer",
        labelEn: "d) EU-Level Added Value",
        description:
          "Ulusötesi boyutun proje çıktıları açısından açıkça değer kattığı gösterilmiş. Kuruluşlar, tek bir ülkedeki kuruluşların ulaşamayacağı sonuçlara ulaşabiliyor.",
        descriptionEn:
          "The transnational dimension is shown to clearly add value to the project's outputs. The organisations can achieve results that organisations in a single country could not reach.",
        tip: "Gerçek rapordan: 'Uluslararası işbirliğinin projeye katma değeri yeterince gösterilmemiş; etkinliklerin büyük çoğunluğu yerel okullarca da düzenlenebilir.' — Her ülkenin getirdiği özgün perspektifi ve 'bu sonuç tek ülkede elde edilemezdi çünkü...' gerekçesini yazın.",
        tipEn:
          "From a real evaluation report: 'The added value of international cooperation to the project was not sufficiently demonstrated; most of the activities could also be organised by local schools alone.' — Write the unique perspective each country brings and a justification such as 'this result could not have been achieved in a single country because...'.",
        formQuestions: [
          {
            text: "What will be the benefits of cooperating with transnational partners to achieve the project objectives?",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
            noteEn: "This entire question is a direct match for this element.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // 2. DESIGN / Tasarım Kalitesi — 30 puan, eşik 15
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "design",
    label: "Tasarım Kalitesi",
    labelEn: "Quality of the project design and implementation",
    maxScore: 30,
    threshold: 15,
    criticalNote:
      "Önerilen çıktılar talep edilen hibe tutarını gerekçeleyemiyorsa bu kriter eşiğin altında puanlanmak ZORUNDADIR → otomatik red. KA210'da götürü tutar sabittir; revize imkânı yoktur.",
    criticalNoteEn:
      "If the proposed outputs cannot justify the requested grant amount, this criterion MUST be scored below the threshold → automatic rejection. In KA210 the lump sum is fixed; there is no possibility of revision.",
    elements: [
      {
        id: "des-a",
        label: "a) Hedeflerin Netliği ve Gerçekçiliği",
        labelEn: "a) Clarity and Realism of the Objectives",
        description:
          "Önerilen hedefler ortak kuruluşların ve hedef gruplarının ihtiyaçlarıyla ilişkili olarak net ve gerçekçi tanımlanmış. Hedef-aktivite-çıktı zinciri tutarlı.",
        descriptionEn:
          "The proposed objectives are clearly and realistically defined in relation to the needs of the partner organisations and target groups. The objective-activity-output chain is consistent.",
        tip: "Gerçek rapordan: 'Öğrencilere yönelik hedef var ancak projenin öğrenci aktivitesi yok; hedef-aktivite-çıktı zinciri tutarsız.' Her hedef için 'Bu hedefe hangi aktivite ile ulaşılacak ve çıktı ne olacak?' sorusunu yanıtlayın.",
        tipEn:
          "From a real evaluation report: 'There is an objective aimed at students, but the project has no student activity; the objective-activity-output chain is inconsistent.' For each objective, answer the question 'Which activity will achieve this objective, and what will the output be?'.",
        formQuestions: [
          {
            text: "What are the concrete objectives you would like to achieve and outcomes or results you would like to realise?",
            note: "Sorunun bu ilk yarısı hedeflerin netliğini ve ölçülebilirliğini değerlendirir.",
            noteEn: "The first half of this question assesses the clarity and measurability of the objectives.",
          },
          {
            text: "Please outline the target groups of your project and describe their identified needs.",
          },
          {
            text: "How does the project address the needs and goals of the participating organisations and the target groups?",
          },
        ],
      },
      {
        id: "des-b",
        label: "b) Erişilebilirlik ve Kapsayıcılık",
        labelEn: "b) Accessibility and Inclusiveness",
        description:
          "Faaliyet tasarımı imkânı kısıtlı bireylerin katılımını artırma potansiyeli taşıyor. Katılımı engelleyebilecek bariyerler kabul edilmiş ve bunları aşmak için gerçekçi eylemler önerilmiş.",
        descriptionEn:
          "The activity design has the potential to increase the participation of individuals with fewer opportunities. Barriers that could hinder participation are acknowledged, and realistic actions to overcome them are proposed.",
        tip: "Gerçek rapordan: 'İmkânı kısıtlı bireylerin dahil edileceğine dair ikna edici argüman yok.' Small-scale ortaklıkların temel amacıyla doğrudan bağlantılı — değerlendirici bunu mutlaka arar.",
        tipEn:
          "From a real evaluation report: 'There is no convincing argument that individuals with fewer opportunities will be included.' This is directly linked to the core purpose of small-scale partnerships — the evaluator will always look for it.",
        formQuestions: [
          {
            text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
            note: "Özellikle 'Inclusion and Diversity' kısmı — engel bariyerleri ve bunları aşmak için alınan somut önlemler.",
            noteEn:
              "Especially the 'Inclusion and Diversity' part — barriers to participation and the concrete measures taken to overcome them.",
          },
          {
            text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
            note: "Her faaliyette tekrar eden soru — dezavantajlı/kırsal öğrencilere öncelik ve farklı öğrenme stillerine uygunluk.",
            noteEn:
              "A recurring question for each activity — priority for disadvantaged/rural students and suitability for different learning styles.",
          },
        ],
      },
      {
        id: "des-c",
        label: "c) Metodoloji, İş Planı ve Maliyet Etkinliği",
        labelEn: "c) Methodology, Work Plan and Cost-Effectiveness",
        description:
          "Faaliyetlerin içeriği ve beklenen sonuçlar spesifik ve gerçekçi. Hazırlık, uygulama, izleme ve paylaşım aşamaları planlanmış. Bütçenin önerilen faaliyetlerle uyumu gösterilmiş; her kalem gerekçelendirilmiş.",
        descriptionEn:
          "The content of the activities and the expected results are specific and realistic. The preparation, implementation, monitoring and dissemination phases are planned. The budget's alignment with the proposed activities is demonstrated; every item is justified.",
        tip: "Gerçek rapordan: 'Yönetim için ayrılan 8.532 EUR'nun ne için kullanılacağı belirsiz; bütçe maliyet etkin kabul edilemez.' Expert Guide: 'the description of the definition of the grant amount is key in this evaluation' — her faaliyetin grant amount gerekçe sorusu kritiktir.",
        tipEn:
          "From a real evaluation report: 'It is unclear what the EUR 8,532 allocated to management will be used for; the budget cannot be considered cost-effective.' Expert Guide: 'the description of the definition of the grant amount is key in this evaluation' — the grant-amount justification question for each activity is critical.",
        formQuestions: [
          {
            text: "Activities table: planned activities, grant amount allocated to each one.",
            note: "Faaliyet adları, tarihler, süreler, tutarlar — iş planının iskeleti.",
            noteEn: "Activity names, dates, durations, amounts — the skeleton of the work plan.",
          },
          {
            text: "Describe the content of the proposed activity.",
            note: "Her faaliyet için.",
            noteEn: "For each activity.",
          },
          {
            text: "Explain how is this activity going to help to reach the project objectives.",
            note: "Her faaliyet için — faaliyet→hedef mantıksal bağlantısı.",
            noteEn: "For each activity — the logical link from activity to objective.",
          },
          {
            text: "Describe the expected results of the activity.",
            note: "Her faaliyet için.",
            noteEn: "For each activity.",
          },
          {
            text: "Please describe how you determined the grant amount attributed to this activity.",
            note: "Her faaliyet için — value for money değerlendirmesinin ANA KANITI. Expert Guide bu soruyu özellikle vurgular.",
            noteEn:
              "For each activity — the MAIN EVIDENCE for the value-for-money assessment. The Expert Guide specifically highlights this question.",
          },
          {
            text: "Budget summary table.",
            note: "Otomatik dolan özet — tutarlılık kontrolü için değerlendirici inceler.",
            noteEn: "An automatically filled summary — the evaluator reviews it to check consistency.",
          },
        ],
      },
      {
        id: "des-d",
        label: "d) Dijital Araçlar ve Erasmus+ Platformları",
        labelEn: "d) Digital Tools and Erasmus+ Platforms",
        description:
          "Dijital araçlar ve öğrenme yöntemleri işbirliğine ve faaliyetlere somut olarak dahil edilmiş. Erasmus+ çevrimiçi platformlarının (eTwinning, EPALE, School Education Gateway, OPR) kullanımı planlanmış.",
        descriptionEn:
          "Digital tools and learning methods are concretely incorporated into the cooperation and the activities. The use of Erasmus+ online platforms (eTwinning, EPALE, School Education Gateway, OPR) is planned.",
        tip: "Her platform için 'hangi aşamada, kim tarafından, ne amacıyla' kullanılacağını yazın. Gerçek rapordan 'güçlü yön': 'EPALE, eTwinning, School Education Gateway gibi platformların nasıl kullanılacağı kapsamlı açıklanmış.'",
        tipEn:
          "For each platform, write 'at which stage, by whom, and for what purpose' it will be used. A 'strength' from a real evaluation report: 'How platforms such as EPALE, eTwinning and School Education Gateway will be used is explained comprehensively.'",
        formQuestions: [
          {
            text: "Please describe how you will use Erasmus+ platforms for preparation, implementation or follow-up of your project?",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
            noteEn: "This entire question is a direct match for this element.",
          },
          {
            text: "How does the project address the horizontal aspects...?",
            note: "Cevabın 'Digital Dimension' kısmı.",
            noteEn: "The 'Digital Dimension' part of the answer.",
          },
          {
            text: "Describe the content of the proposed activity.",
            note: "Her faaliyette — dijital araç kullanımına ilişkin ifadeler.",
            noteEn: "In each activity — statements relating to the use of digital tools.",
          },
        ],
      },
      {
        id: "des-e",
        label: "e) Çevre Dostu Tasarım",
        labelEn: "e) Environmentally Friendly Design",
        description:
          "Proje çevre ve iklim değişikliği konularında farkındalık yaratma potansiyeline sahip. Ekolojik uygulamalar yoluyla davranış değişikliği öngörülmüş.",
        descriptionEn:
          "The project has the potential to raise awareness on environmental and climate-change issues. Behavioural change through ecological practices is envisaged.",
        tip: "Gerçek rapordan: 'Eko-uygulamaların faaliyetlere nasıl entegre edileceğine dair açıklama yok; ifadeler çok soyut.' Somut örnekler: dijital materyaller basılı yerine, hareketlilik için tren/toplu taşıma, atık azaltma politikası.",
        tipEn:
          "From a real evaluation report: 'There is no explanation of how eco-practices will be integrated into the activities; the statements are too abstract.' Concrete examples: digital materials instead of printed ones, train/public transport for mobility, a waste-reduction policy.",
        formQuestions: [
          {
            text: "How does the project address the horizontal aspects of inclusion and diversity, environmental sustainability, digital dimension and/or participation and civic engagement?",
            note: "Cevabın 'Environmental Sustainability' kısmı — proje konusundan bağımsız olarak uygulama pratiklerine bakılır.",
            noteEn:
              "The 'Environmental Sustainability' part of the answer — the implementation practices are examined independently of the project's topic.",
          },
        ],
      },
      {
        id: "des-f",
        label: "f) Katılım ve Sivil Angajman",
        labelEn: "f) Participation and Civic Engagement",
        description:
          "Hedef grupların aktif katılımını teşvik eden ve toplum yaşamına angajmanlarını güçlendiren faaliyetler içeriyor. Katılımcılara anlamlı aktif rol fırsatları sunuluyor.",
        descriptionEn:
          "Includes activities that encourage the active participation of target groups and strengthen their engagement in community life. Participants are offered meaningful, active roles.",
        tip: "Salt alıcı (pasif) değil, aktif paydaş konumlandırması. 'Öğrenciler atölyelere katılacak' yerine 'Öğrenciler yerel etkinliği planlayacak, içerikleri birlikte tasarlayacak ve sunumu yönetecek.'",
        tipEn:
          "Position participants as active stakeholders, not merely passive recipients. Instead of 'Students will attend workshops', write 'Students will plan the local event, co-design the content and run the presentation.'",
        formQuestions: [
          {
            text: "How does the project address the horizontal aspects...?",
            note: "Cevabın 'Participation and Civic Engagement' kısmı.",
            noteEn: "The 'Participation and Civic Engagement' part of the answer.",
          },
          {
            text: "Describe the content of the proposed activity.",
            note: "Her faaliyette — ortak karar alma, birlikte tasarlama, topluma katkı ifadeleri.",
            noteEn: "In each activity — statements on joint decision-making, co-design and contribution to the community.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // 3. PARTNERSHIP / Ortaklık — 20 puan, eşik 10
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "partnership",
    label: "Ortaklık Kalitesi",
    labelEn: "Quality of the partnership and the cooperation arrangements",
    maxScore: 20,
    threshold: 10,
    elements: [
      {
        id: "par-a",
        label: "a) Uygun Kuruluş Karması",
        labelEn: "a) Appropriate Mix of Organisations",
        description:
          "Katılan kuruluşların katılım nedenleri ve ortak çıkarları açıkça anlatılmış. Her kuruluşun rolü ve katkısı net tanımlanmış. Kuruluşlar önerilen faaliyetleri yürütecek beceri ve yetkinliklere sahip.",
        descriptionEn:
          "The participating organisations' reasons for joining and their shared interests are clearly explained. Each organisation's role and contribution is clearly defined. The organisations have the skills and competences to carry out the proposed activities.",
        tip: "Her ortak için 'Bu kuruluş bu projede neden vazgeçilmez?' sorusunu yanıtlayın. Teknik uzmanlık, hedef gruba erişim, ülke deneyimi veya kurumsal kapasite — en az biri somut yazılmalı.",
        tipEn:
          "For each partner, answer the question 'Why is this organisation indispensable to this project?'. At least one of the following must be written concretely: technical expertise, access to the target group, country experience, or institutional capacity.",
        formQuestions: [
          {
            text: "How was the partnership formed? What are the strengths that each partner will bring to the project?",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
            noteEn: "This entire question is a direct match for this element.",
          },
          {
            text: "What are the organisation's main activities? / What are the organisation's activities in the field of this application?",
            note: "Her kuruluşun profil ve deneyim cevapları — kuruluş karmasının kanıtı.",
            noteEn: "Each organisation's profile and experience answers — evidence of the mix of organisations.",
          },
        ],
      },
      {
        id: "par-b",
        label: "b) Yeni Gelen / Az Deneyimli Kuruluşların Dahil Edilmesi",
        labelEn: "b) Inclusion of Newcomer / Less Experienced Organisations",
        description:
          "Small-scale ortaklıklar daha önce bu eylemden düzenli yararlanmamış kuruluşlar için bir 'basamak taşı'dır. Değerlendirici formdaki geçmiş katılım bilgilerini kullanır ve Programme Guide sözlüğündeki tanımları birebir uygular.",
        descriptionEn:
          "Small-scale partnerships are a 'stepping stone' for organisations that have not regularly benefited from this action before. The evaluator uses the past-participation information in the form and applies the definitions in the Programme Guide glossary literally.",
        tip: "İlk kez başvuran veya az deneyimli ortaklar varsa bunu açıkça belirtin — small-scale programının ruhuna uygundur ve olumlu karşılanır.",
        tipEn:
          "If there are first-time applicants or less experienced partners, state this explicitly — it fits the spirit of the small-scale programme and is viewed positively.",
        formQuestions: [
          {
            text: "Newcomer organisation: Yes/No — Less experienced organisation: Yes/No — First time applicant: Yes/No",
            note: "Her kuruluş için otomatik/beyan alanları.",
            noteEn: "Automatic/declared fields for each organisation.",
          },
          {
            text: "How many years of experience does the organisation have working in the field of this application?",
          },
          {
            text: "Past participation table (Number of project applications / Number of granted projects).",
            note: "Değerlendirici bu tabloyu kullanarak newcomer/less experienced tanımını uygular ve sonucu tipoloji sorularına kaydeder.",
            noteEn:
              "The evaluator uses this table to apply the newcomer/less-experienced definition and records the result against the typology questions.",
          },
          {
            text: "Would you like to make any comments or add any information to the summary of your organisation's past participation?",
          },
        ],
      },
      {
        id: "par-c",
        label: "c) Görev Dağılımı",
        labelEn: "c) Task Allocation",
        description:
          "Roller ve görevler net tanımlanmış, faaliyetlerin doğasına ve ortakların deneyimine göre dengeli dağıtılmış. Tüm ortakların aktif katkısı gösterilmiş.",
        descriptionEn:
          "Roles and tasks are clearly defined and balanced according to the nature of the activities and the partners' experience. The active contribution of all partners is demonstrated.",
        tip: "Gerçek rapordan: 'Görevler çok geniş/soyut; Makedonya ortağının teknik destek görevinin aktivitelerle ilişkisi belirsiz.' Her ortak için 'Faaliyet X: bu ortak şunu yapar, şu çıktıdan sorumludur' formatı kullanın.",
        tipEn:
          "From a real evaluation report: 'The tasks are too broad/abstract; it is unclear how the North Macedonian partner's technical-support task relates to the activities.' For each partner, use the format 'Activity X: this partner does Y, is responsible for output Z'.",
        formQuestions: [
          {
            text: "Please describe the tasks and responsibilities of each partner organisation in the project.",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
            noteEn: "This entire question is a direct match for this element.",
          },
          {
            text: "Leading Organisation and Participating organisations fields in each activity.",
            note: "Her faaliyetteki lider/katılımcı kuruluş alanları — görev dağılımının yapısal kanıtı.",
            noteEn: "The lead/participating organisation fields in each activity — structural evidence of the task allocation.",
          },
        ],
      },
      {
        id: "par-d",
        label: "d) Koordinasyon ve İletişim Mekanizmaları",
        labelEn: "d) Coordination and Communication Mechanisms",
        description:
          "Proje koordinasyon yöntemleri ve iletişim araçları net tanımlanmış; kuruluşlar arası iyi işbirliğini sağlamaya uygun.",
        descriptionEn:
          "The project's coordination methods and communication tools are clearly defined and suited to ensuring good cooperation between the organisations.",
        tip: "Minimum: toplantı sıklığı, platform (Zoom/Teams/e-posta), koordinatör rolü, karar alma mekanizması. Anlaşmazlık çözüm yöntemi eklenirse daha güçlü olur.",
        tipEn:
          "At minimum, include: meeting frequency, platform (Zoom/Teams/email), the coordinator's role, and the decision-making mechanism. Adding a conflict-resolution method makes it stronger.",
        formQuestions: [
          {
            text: "How will you ensure sound management of the project and good cooperation and communication between partners during project implementation?",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
            noteEn: "This entire question is a direct match for this element.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // 4. IMPACT / Etki — 20 puan, eşik 10
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "impact",
    label: "Etki",
    labelEn: "Impact",
    maxScore: 20,
    threshold: 10,
    elements: [
      {
        id: "imp-a",
        label: "a) Sonuçların Kurumlara Entegrasyonu",
        labelEn: "a) Integration of Results into the Organisations",
        description:
          "Ortaklığın elde edilen sonuçları ortak kuruluşların günlük çalışmalarına entegre etme önerileri spesifik, net ve etkili. Sonuçların proje bittikten sonra kurumsal rutine nasıl yerleşeceği açıkça tanımlanmış.",
        descriptionEn:
          "The partnership's proposals for integrating the results achieved into the partner organisations' day-to-day work are specific, clear and effective. How the results will become embedded in institutional routine after the project ends is clearly defined.",
        tip: "Gerçek rapordan: 'Sonuçların günlük aktivitelere entegrasyon planı belirsiz; ifadeler deklaratif.' Güçlü örnek: 'Geliştirilen dijital okuryazarlık modülü Eylül 2027'de X dersin müfredatına Okul Kurulu kararıyla eklenecek; sorumlu: Müdür Yardımcısı Y.'",
        tipEn:
          "From a real evaluation report: 'The plan for integrating the results into daily activities is unclear; the statements are declarative.' Strong example: 'The digital literacy module developed will be added to the curriculum of subject X by a School Board decision in September 2027; responsible: Deputy Head Y.'",
        formQuestions: [
          {
            text: "How will the participation in this project contribute to the development of the involved organisations in the long-term? Do you have plans to continue using the results of the project or continue to implement some of the activities after the project's end?",
            note: "Sorunun 'continue using the results' kısmı bu unsurun ana kanıtıdır.",
            noteEn: "The 'continue using the results' part of the question is the main evidence for this element.",
          },
        ],
      },
      {
        id: "imp-b",
        label: "b) Katılımcı, Kurum ve Topluma Etki",
        labelEn: "b) Impact on Participants, Organisations and the Community",
        description:
          "Proje uygulama sırasında ve sonrasında katılımcı kuruluşlar, personel ve öğrenenler üzerinde önemli olumlu etki yaratabilir. Projeye katılmayan ancak faaliyetlerden olumlu etkilenecek hedef gruplar da tanımlanmış.",
        descriptionEn:
          "The project can create significant positive impact on the participating organisations, staff and learners during and after implementation. Target groups who do not take part in the project but will be positively affected by its activities are also identified.",
        tip: "Üç katman gerekiyor: (1) bireysel katılımcı etkisi, (2) kurumsal etki, (3) toplumsal/geniş etki. Gerçek rapordan: 'Etki potansiyeli var ancak ifadeler çok deklaratif; somut örneklerle desteklenmiyor.'",
        tipEn:
          "Three layers are needed: (1) impact on individual participants, (2) institutional impact, (3) community/wider impact. From a real evaluation report: 'There is potential for impact, but the statements are too declarative; they are not supported by concrete examples.'",
        formQuestions: [
          {
            text: "How will the participation in this project contribute to the development of the involved organisations in the long-term?",
            note: "Sorunun kurumsal gelişime katkı kısmı.",
            noteEn: "The part of the question on contribution to institutional development.",
          },
          {
            text: "Describe the target group for this activity. Who is going to take part and who is going to benefit from the results?",
            note: "Her faaliyette — dolaylı hedef gruplar: okul yönetimi, veliler, yerel topluluk.",
            noteEn: "In each activity — indirect target groups: school management, parents, the local community.",
          },
          {
            text: "Describe the expected results of the activity.",
            note: "Her faaliyette — nicel/nitel etki göstergeleri.",
            noteEn: "In each activity — quantitative/qualitative impact indicators.",
          },
        ],
      },
      {
        id: "imp-c",
        label: "c) Değerlendirme Yöntemi",
        labelEn: "c) Evaluation Method",
        description:
          "Ortaklık, önerilen faaliyetlerin beklenen faydalarının elde edilip edilmediğini nasıl değerlendireceğine dair plana sahip. Ölçülebilir göstergelerle izleme yapılacak.",
        descriptionEn:
          "The partnership has a plan for how it will assess whether the expected benefits of the proposed activities have been achieved. Monitoring will be carried out using measurable indicators.",
        tip: "Gerçek rapordan: 'SMART göstergelere dayanan performans izleme sistemi var ama açıklama soyut; yeterli nicel/nitel gösterge yok.' Minimum 2-3 somut KPI yazın: 'Anket puanı X'ten Y'ye çıkacak; sorumlu: Koordinatör, tarih: Aralık 2025.'",
        tipEn:
          "From a real evaluation report: 'There is a performance-monitoring system based on SMART indicators, but the explanation is abstract; there are not enough quantitative/qualitative indicators.' Write at least 2-3 concrete KPIs: 'Survey score will rise from X to Y; responsible: Coordinator, date: December 2025.'",
        formQuestions: [
          {
            text: "How will you know if the project has achieved its objectives? Please explain how you will measure it.",
            note: "Bu sorunun tamamı bu unsurun birebir karşılığıdır.",
            noteEn: "This entire question is a direct match for this element.",
          },
        ],
      },
      {
        id: "imp-d",
        label: "d) Yaygınlaştırma ve AB Görünürlüğü",
        labelEn: "d) Dissemination and EU Visibility",
        description:
          "İlgili hedef gruplara sunulabilecek proje sonuçları tanımlanmış. Sonuçların geniş yayılması için somut kanallar belirlenmiş. AB finansmanı kamuya açıkça kabul edilmiş.",
        descriptionEn:
          "The project results that can be presented to the relevant target groups are identified. Concrete channels for the wide dissemination of the results are identified. EU funding is explicitly acknowledged to the public.",
        tip: "Gerçek rapordan 'güçlü yön': 'Sosyal medya, atölyeler, Erasmus+ platformları, yerel etkinlikler ve yayınlar dahil çeşitli kanallar belirlenmiş.' AB fonunu tanıma için 'funded by the European Union' ifadesi ve AB logosuna atıf bu cevabın içinde açıkça yer almalı — bunun için ayrı form sorusu yoktur.",
        tipEn:
          "A 'strength' from a real evaluation report: 'A variety of channels have been identified, including social media, workshops, Erasmus+ platforms, local events and publications.' To acknowledge EU funding, the phrase 'funded by the European Union' and a reference to the EU logo must appear explicitly within this answer — there is no separate form question for this.",
        formQuestions: [
          {
            text: "Please describe your plans for sharing and use of project results.",
            note: "Tüm alt maddeleriyle bu sorunun birebir karşılığı.",
            noteEn: "A direct match for this question, including all its sub-items.",
          },
          {
            text: "How will you make the results of your project known within your partnership, in your local communities and in the wider public? Who are the main target groups you would like to share your results with?",
          },
          {
            text: "Are there other groups or organisations that will benefit from your project? Please explain how.",
          },
        ],
      },
    ],
  },
];

export const TOTAL_MAX = 100;
export const TOTAL_THRESHOLD = 60;
