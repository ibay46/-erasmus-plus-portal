-- AlterTable
ALTER TABLE "Post"
  ADD COLUMN "eventActivityType" TEXT,
  ADD COLUMN "eventOrganiser" TEXT,
  ADD COLUMN "eventApplicationDeadlineEnd" TIMESTAMP(3),
  ADD COLUMN "eventSelectionDate" TIMESTAMP(3),
  ADD COLUMN "eventTargetFor" TEXT,
  ADD COLUMN "eventTargetFrom" TEXT,
  ADD COLUMN "eventRecommendedFor" TEXT;
