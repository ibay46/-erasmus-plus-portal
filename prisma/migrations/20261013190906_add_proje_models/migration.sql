-- CreateTable
CREATE TABLE "Proje" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Adsız Proje',
    "projeAdi" TEXT NOT NULL DEFAULT '',
    "projeNumarasi" TEXT NOT NULL DEFAULT '',
    "kaAction" TEXT NOT NULL DEFAULT '',
    "baslangicTarihi" TIMESTAMP(3),
    "bitisTarihi" TIMESTAMP(3),
    "durationMonths" INTEGER,
    "toplamButce" DOUBLE PRECISION,
    "benimKurulusum" INTEGER NOT NULL DEFAULT -1,
    "coordinator" JSONB NOT NULL DEFAULT '{}',
    "partners" JSONB NOT NULL DEFAULT '[]',
    "yurutucuAd" TEXT NOT NULL DEFAULT '',
    "yurutucuSoyad" TEXT NOT NULL DEFAULT '',
    "yurutucuTelefon" TEXT NOT NULL DEFAULT '',
    "yurutucuEposta" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjeToolData" (
    "id" TEXT NOT NULL,
    "projeId" TEXT NOT NULL,
    "toolKey" TEXT NOT NULL,
    "variant" TEXT NOT NULL DEFAULT '',
    "data" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjeToolData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Proje_userId_idx" ON "Proje"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjeToolData_projeId_toolKey_variant_key" ON "ProjeToolData"("projeId", "toolKey", "variant");

-- AddForeignKey
ALTER TABLE "Proje" ADD CONSTRAINT "Proje_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjeToolData" ADD CONSTRAINT "ProjeToolData_projeId_fkey" FOREIGN KEY ("projeId") REFERENCES "Proje"("id") ON DELETE CASCADE ON UPDATE CASCADE;
