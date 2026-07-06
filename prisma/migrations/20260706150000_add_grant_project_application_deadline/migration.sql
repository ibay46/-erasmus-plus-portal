-- AlterTable
ALTER TABLE "GrantProject" ADD COLUMN "applicationDeadline" TIMESTAMP(3);

-- Backfill existing rows with a placeholder so the column can become required;
-- admins should review and correct the real deadline for these older entries.
UPDATE "GrantProject" SET "applicationDeadline" = "createdAt" + INTERVAL '30 days' WHERE "applicationDeadline" IS NULL;

-- AlterTable
ALTER TABLE "GrantProject" ALTER COLUMN "applicationDeadline" SET NOT NULL;
