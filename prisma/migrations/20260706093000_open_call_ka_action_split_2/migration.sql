-- AlterTable: kaAction/sectors are now backfilled for every row, make them
-- required and drop the old combined "combos" column.
ALTER TABLE "OpenCall" ALTER COLUMN "kaAction" SET NOT NULL;
ALTER TABLE "OpenCall" ALTER COLUMN "sectors" SET NOT NULL;
ALTER TABLE "OpenCall" ALTER COLUMN "sectors" SET DEFAULT '';
ALTER TABLE "OpenCall" DROP COLUMN "combos";
