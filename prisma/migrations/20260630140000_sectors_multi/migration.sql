-- sector (enum) → sectors (text, comma-separated) dönüşümü
ALTER TABLE "ProjectResult" RENAME COLUMN "sector" TO "sectors";
ALTER TABLE "ProjectResult" ALTER COLUMN "sectors" TYPE TEXT USING "sectors"::TEXT;
ALTER TABLE "ProjectResult" ALTER COLUMN "sectors" SET DEFAULT '';
DROP TYPE "EducationSector";
