export type Country = "Finlandiya" | "İsveç" | "Slovenya" | "Çek Cumhuriyeti" | "Avusturya" | "Yunanistan";

export function landmarkSvg(country: Country): string {
  const svg = (inner: string) =>
    `<svg viewBox="0 0 1080 620" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  // Warm "golden hour" palette shared by all landmarks
  const blob1 = "#f0b860"; // lit stone / gold
  const blob2 = "#fde4a8"; // bright highlight (domes, spires, lights)
  const dark = "#3a1d10"; // grounding shadow tone

  if (country === "Finlandiya") {
    // Helsinki Tuomiokirkko (Helsinki Cathedral)
    return svg(`
      <polygon points="380,560 700,560 660,500 420,500" fill="${dark}" opacity="0.55" />
      <rect x="390" y="420" width="300" height="90" fill="${blob1}" opacity="0.92" />
      <polygon points="390,420 540,360 690,420" fill="${blob1}" opacity="0.92" />
      <g opacity="0.9">
        <rect x="410" y="420" width="10" height="90" fill="${dark}" />
        <rect x="450" y="420" width="10" height="90" fill="${dark}" />
        <rect x="490" y="420" width="10" height="90" fill="${dark}" />
        <rect x="580" y="420" width="10" height="90" fill="${dark}" />
        <rect x="620" y="420" width="10" height="90" fill="${dark}" />
        <rect x="660" y="420" width="10" height="90" fill="${dark}" />
      </g>
      <circle cx="430" cy="400" r="16" fill="${blob1}" opacity="0.95" />
      <polygon points="414,400 430,372 446,400" fill="${blob1}" opacity="0.95" />
      <circle cx="650" cy="400" r="16" fill="${blob1}" opacity="0.95" />
      <polygon points="634,400 650,372 666,400" fill="${blob1}" opacity="0.95" />
      <rect x="485" y="300" width="110" height="80" fill="${blob1}" opacity="0.95" />
      <ellipse cx="540" cy="298" rx="95" ry="68" fill="${blob2}" />
      <rect x="532" y="200" width="16" height="40" fill="${blob2}" />
      <circle cx="540" cy="195" r="9" fill="${blob2}" />
      <circle cx="450" cy="455" r="5" fill="${blob2}" opacity="0.85" />
      <circle cx="540" cy="455" r="5" fill="${blob2}" opacity="0.85" />
      <circle cx="630" cy="455" r="5" fill="${blob2}" opacity="0.85" />
    `);
  }

  if (country === "İsveç") {
    // Stockholm City Hall (Stadshuset)
    return svg(`
      <rect x="160" y="480" width="760" height="90" fill="${blob1}" opacity="0.9" />
      <g opacity="0.9">
        ${Array.from({ length: 11 })
          .map(
            (_, i) =>
              `<rect x="${190 + i * 65}" y="500" width="34" height="50" rx="17" fill="${dark}" /><circle cx="${207 + i * 65}" cy="520" r="4" fill="${blob2}" opacity="0.8" />`
          )
          .join("")}
      </g>
      <rect x="478" y="150" width="124" height="340" fill="${blob1}" opacity="0.95" />
      <polygon points="478,150 540,70 602,150" fill="${blob1}" opacity="0.95" />
      <g opacity="0.85">
        ${Array.from({ length: 6 })
          .map((_, i) => `<rect x="${500 + i * 17}" y="${180 + (i % 2) * 40}" width="10" height="16" fill="${dark}" />`)
          .join("")}
      </g>
      <rect x="530" y="55" width="20" height="35" fill="${blob2}" />
      <circle cx="525" cy="45" r="14" fill="${blob2}" />
      <circle cx="555" cy="45" r="14" fill="${blob2}" />
      <circle cx="540" cy="28" r="14" fill="${blob2}" />
    `);
  }

  if (country === "Slovenya") {
    // Ljubljana Castle on the hill + Triple Bridge (Tromostovje)
    return svg(`
      <ellipse cx="560" cy="500" rx="320" ry="160" fill="${dark}" opacity="0.6" />
      <rect x="430" y="330" width="50" height="90" fill="${blob1}" opacity="0.92" />
      <polygon points="430,330 455,300 480,330" fill="${blob1}" opacity="0.92" />
      <rect x="500" y="300" width="60" height="120" fill="${blob1}" opacity="0.95" />
      <polygon points="500,300 530,265 560,300" fill="${blob1}" opacity="0.95" />
      <rect x="600" y="340" width="46" height="80" fill="${blob1}" opacity="0.92" />
      <polygon points="600,340 623,312 646,340" fill="${blob1}" opacity="0.92" />
      <circle cx="455" cy="345" r="4" fill="${blob2}" />
      <circle cx="530" cy="285" r="5" fill="${blob2}" />
      <circle cx="623" cy="328" r="4" fill="${blob2}" />
      <rect x="0" y="560" width="1080" height="20" fill="${dark}" opacity="0.7" />
      <path d="M 380 568 Q 460 478 540 568" fill="none" stroke="${blob1}" stroke-width="16" opacity="0.95" />
      <path d="M 540 568 Q 620 478 700 568" fill="none" stroke="${blob1}" stroke-width="16" opacity="0.95" />
      <path d="M 460 568 Q 540 498 620 568" fill="none" stroke="${blob2}" stroke-width="10" opacity="0.85" />
    `);
  }

  if (country === "Avusturya") {
    // Schönbrunn Sarayı (Viyana) — uzun simetrik cephe + merkezi alınlık
    return svg(`
      <rect x="120" y="430" width="840" height="110" fill="${blob1}" opacity="0.92" />
      <rect x="460" y="350" width="160" height="190" fill="${blob1}" opacity="0.95" />
      <polygon points="460,350 540,300 620,350" fill="${blob1}" opacity="0.95" />
      <circle cx="540" cy="330" r="10" fill="${blob2}" />
      <g opacity="0.85">
        ${Array.from({ length: 14 })
          .map((_, i) => `<rect x="${150 + i * 58}" y="455" width="22" height="40" fill="${dark}" />`)
          .join("")}
      </g>
      <g opacity="0.8">
        ${Array.from({ length: 14 })
          .map((_, i) => `<circle cx="${161 + i * 58}" cy="445" r="6" fill="${blob2}" />`)
          .join("")}
      </g>
      <rect x="120" y="540" width="840" height="20" fill="${dark}" opacity="0.6" />
    `);
  }

  if (country === "Yunanistan") {
    // Parthenon (Akropolis, Atina) — sütun sırası + üçgen alınlık
    return svg(`
      <ellipse cx="540" cy="540" rx="380" ry="60" fill="${dark}" opacity="0.5" />
      <rect x="180" y="470" width="720" height="30" fill="${dark}" opacity="0.7" />
      <rect x="200" y="430" width="680" height="40" fill="${blob1}" opacity="0.95" />
      <g opacity="0.92">
        ${Array.from({ length: 9 })
          .map((_, i) => `<rect x="${220 + i * 80}" y="290" width="26" height="140" fill="${blob1}" />`)
          .join("")}
      </g>
      <g opacity="0.8">
        ${Array.from({ length: 9 })
          .map((_, i) => `<circle cx="${233 + i * 80}" cy="300" r="5" fill="${blob2}" />`)
          .join("")}
      </g>
      <rect x="200" y="260" width="680" height="30" fill="${blob1}" opacity="0.95" />
      <polygon points="190,260 540,160 890,260" fill="${blob1}" opacity="0.95" />
      <polygon points="230,255 540,180 850,255" fill="${dark}" opacity="0.3" />
      <circle cx="540" cy="210" r="6" fill="${blob2}" />
    `);
  }

  // Çek Cumhuriyeti — Charles Bridge (Karlův most) + Prague Castle (St. Vitus)
  return svg(`
    <ellipse cx="540" cy="430" rx="340" ry="130" fill="${dark}" opacity="0.55" />
    <rect x="470" y="210" width="18" height="170" fill="${blob1}" opacity="0.9" />
    <polygon points="470,210 479,180 488,210" fill="${blob1}" opacity="0.9" />
    <rect x="590" y="210" width="18" height="170" fill="${blob1}" opacity="0.9" />
    <polygon points="590,210 599,180 608,210" fill="${blob1}" opacity="0.9" />
    <rect x="520" y="260" width="40" height="120" fill="${blob1}" opacity="0.85" />
    <circle cx="479" cy="240" r="4" fill="${blob2}" />
    <circle cx="599" cy="240" r="4" fill="${blob2}" />
    <rect x="0" y="540" width="1080" height="40" fill="${blob1}" opacity="0.85" />
    <rect x="495" y="440" width="90" height="100" fill="${blob1}" opacity="0.95" />
    <polygon points="495,440 540,395 585,440" fill="${blob1}" opacity="0.95" />
    <circle cx="540" cy="420" r="6" fill="${blob2}" />
    <g opacity="0.85">
      ${Array.from({ length: 9 })
        .map(
          (_, i) =>
            `<rect x="${60 + i * 120}" y="520" width="6" height="40" fill="${dark}" /><circle cx="${63 + i * 120}" cy="516" r="6" fill="${blob2}" />`
        )
        .join("")}
    </g>
  `);
}
