-- CreateTable
CREATE TABLE "OpenCall" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "round" TEXT NOT NULL,
    "kaAction" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "agencyName" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "externalUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenCall_pkey" PRIMARY KEY ("id")
);
