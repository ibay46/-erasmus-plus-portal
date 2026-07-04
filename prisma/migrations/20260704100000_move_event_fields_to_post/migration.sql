-- Etkinlikler artık ayrı bir model/sayfa değil; SALTO Education & Training
-- içeriği eklenirken Post üzerinde doldurulan opsiyonel alanlar haline geldi.

-- DropTable
DROP TABLE "Etkinlik";

-- Rename enum EtkinlikFormat -> EventFormat
ALTER TYPE "EtkinlikFormat" RENAME TO "EventFormat";

-- AlterTable
ALTER TABLE "Post"
  ADD COLUMN "eventFormat" "EventFormat",
  ADD COLUMN "eventStartDate" TIMESTAMP(3),
  ADD COLUMN "eventEndDate" TIMESTAMP(3),
  ADD COLUMN "eventSectors" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "eventVenue" TEXT,
  ADD COLUMN "eventPriority" TEXT,
  ADD COLUMN "eventApplicationDeadline" TIMESTAMP(3),
  ADD COLUMN "eventLanguage" TEXT;
