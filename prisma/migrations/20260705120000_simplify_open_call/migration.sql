-- AlterTable
ALTER TABLE "OpenCall" RENAME COLUMN "kaAction" TO "kaActions";
ALTER TABLE "OpenCall" DROP COLUMN "agencyName";
ALTER TABLE "OpenCall" DROP COLUMN "externalUrl";
