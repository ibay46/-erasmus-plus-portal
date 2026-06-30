-- kaAction (enum) → kaActions (text, comma-separated) dönüşümü
ALTER TABLE "ProjectResult" RENAME COLUMN "kaAction" TO "kaActions";
ALTER TABLE "ProjectResult" ALTER COLUMN "kaActions" TYPE TEXT USING "kaActions"::TEXT;
ALTER TABLE "ProjectResult" ALTER COLUMN "kaActions" SET DEFAULT '';
DROP TYPE "KaAction";
