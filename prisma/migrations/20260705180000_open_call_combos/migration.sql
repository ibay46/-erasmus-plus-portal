-- AlterTable
ALTER TABLE "OpenCall" ADD COLUMN "combos" TEXT NOT NULL DEFAULT '';

-- Backfill: reconstruct valid (KA eylemi, sektör) çiftlerini eski kaActions/sectors
-- çapraz çarpımından, sadece gerçekten geçerli kombinasyonlarla sınırlayarak kur.
UPDATE "OpenCall" o
SET "combos" = sub.combos
FROM (
  SELECT o2.id, string_agg(DISTINCT valid.ka || ':' || valid.sector, ',') AS combos
  FROM "OpenCall" o2
  CROSS JOIN LATERAL unnest(string_to_array(o2."kaActions", ',')) AS picked_ka(ka)
  CROSS JOIN LATERAL unnest(string_to_array(o2."sectors", ',')) AS picked_sector(sector)
  JOIN (VALUES
    ('KA210','SCH'), ('KA210','VET'), ('KA210','ADU'), ('KA210','YOU'),
    ('KA220','SCH'), ('KA220','VET'), ('KA220','ADU'), ('KA220','YOU'), ('KA220','HED'),
    ('KA240','SCH')
  ) AS valid(ka, sector)
    ON valid.ka = picked_ka.ka AND valid.sector = picked_sector.sector
  GROUP BY o2.id
) sub
WHERE o.id = sub.id;

-- AlterTable
ALTER TABLE "OpenCall" DROP COLUMN "kaActions";
ALTER TABLE "OpenCall" DROP COLUMN "sectors";
