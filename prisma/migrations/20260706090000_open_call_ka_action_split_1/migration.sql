-- AlterTable: add nullable kaAction/sectors columns; data backfill (splitting
-- combos into one row per KA action) runs separately before the next migration
-- makes them required and drops "combos".
ALTER TABLE "OpenCall" ADD COLUMN "kaAction" TEXT;
ALTER TABLE "OpenCall" ADD COLUMN "sectors" TEXT;
