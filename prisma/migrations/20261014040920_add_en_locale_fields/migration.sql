-- AlterTable
ALTER TABLE "GrantProject" ADD COLUMN     "bodyEn" TEXT,
ADD COLUMN     "excerptEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "bodyEn" TEXT,
ADD COLUMN     "eventActivityTypeEn" TEXT,
ADD COLUMN     "eventPriorityEn" TEXT,
ADD COLUMN     "eventRecommendedForEn" TEXT,
ADD COLUMN     "eventTargetForEn" TEXT,
ADD COLUMN     "eventTargetFromEn" TEXT,
ADD COLUMN     "eventVenueEn" TEXT,
ADD COLUMN     "excerptEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "ProjectLibraryEntry" ADD COLUMN     "budgetLogicEn" TEXT,
ADD COLUMN     "disseminationEn" TEXT,
ADD COLUMN     "objectivesEn" TEXT,
ADD COLUMN     "summaryEn" TEXT,
ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "workPackagesEn" TEXT;

-- AlterTable
ALTER TABLE "ProjectResult" ADD COLUMN     "bodyEn" TEXT,
ADD COLUMN     "countryEn" TEXT,
ADD COLUMN     "summaryEn" TEXT,
ADD COLUMN     "titleEn" TEXT;
