-- CreateEnum
CREATE TYPE "EtkinlikFormat" AS ENUM ('PHYSICAL', 'ONLINE');

-- CreateTable
CREATE TABLE "Etkinlik" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "format" "EtkinlikFormat" NOT NULL DEFAULT 'PHYSICAL',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "sectors" TEXT NOT NULL DEFAULT '',
    "venue" TEXT NOT NULL,
    "priority" TEXT,
    "applicationDeadline" TIMESTAMP(3),
    "language" TEXT NOT NULL,
    "externalUrl" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Etkinlik_pkey" PRIMARY KEY ("id")
);
