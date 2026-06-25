-- CreateEnum
CREATE TYPE "KaAction" AS ENUM ('KA210', 'KA220', 'KA240');

-- CreateEnum
CREATE TYPE "EducationSector" AS ENUM ('SCH', 'VET', 'ADU', 'YOU', 'HED');

-- AlterTable
ALTER TABLE "ProjectResult" ADD COLUMN "kaAction" "KaAction";
ALTER TABLE "ProjectResult" ADD COLUMN "sector" "EducationSector";
