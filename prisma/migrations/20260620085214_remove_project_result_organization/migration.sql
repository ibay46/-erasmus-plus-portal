/*
  Warnings:

  - You are about to drop the column `organization` on the `ProjectResult` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "projectType" TEXT NOT NULL,
    "country" TEXT,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ProjectResult" ("body", "country", "coverImage", "createdAt", "id", "projectType", "published", "slug", "summary", "title", "updatedAt", "year") SELECT "body", "country", "coverImage", "createdAt", "id", "projectType", "published", "slug", "summary", "title", "updatedAt", "year" FROM "ProjectResult";
DROP TABLE "ProjectResult";
ALTER TABLE "new_ProjectResult" RENAME TO "ProjectResult";
CREATE UNIQUE INDEX "ProjectResult_slug_key" ON "ProjectResult"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
