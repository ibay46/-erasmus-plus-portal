-- AlterTable: track an hashed IP+UA fingerprint per submission so anonymous
-- tool usage (e.g. daily AI generation limits) can be rate-limited without
-- storing raw IP addresses.
ALTER TABLE "ToolSubmission" ADD COLUMN "visitorHash" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "ToolSubmission_toolKey_visitorHash_createdAt_idx" ON "ToolSubmission"("toolKey", "visitorHash", "createdAt");
