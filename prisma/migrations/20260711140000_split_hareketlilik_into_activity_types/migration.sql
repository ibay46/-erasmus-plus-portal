-- Split the single "hareketlilikSayisi" count into three activity-type counts
-- (ulusotesiSayisi, yerelSayisi, yonetimYayginSayisi), matching the real KA210-SCH
-- form's distinction between transnational (day-based), local (hour-based) and
-- management & dissemination activities.

ALTER TABLE "ApplicationFormSession" ADD COLUMN "ulusotesiSayisi" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "ApplicationFormSession" ADD COLUMN "yerelSayisi" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ApplicationFormSession" ADD COLUMN "yonetimYayginSayisi" INTEGER NOT NULL DEFAULT 0;

-- Preserve existing data: carry the old count over as the transnational count.
UPDATE "ApplicationFormSession" SET "ulusotesiSayisi" = "hareketlilikSayisi";

ALTER TABLE "ApplicationFormSession" DROP COLUMN "hareketlilikSayisi";
