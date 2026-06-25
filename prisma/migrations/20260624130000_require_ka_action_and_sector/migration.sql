-- Make ProjectResult.kaAction and ProjectResult.sector required
ALTER TABLE "ProjectResult" ALTER COLUMN "kaAction" SET NOT NULL;
ALTER TABLE "ProjectResult" ALTER COLUMN "sector" SET NOT NULL;
