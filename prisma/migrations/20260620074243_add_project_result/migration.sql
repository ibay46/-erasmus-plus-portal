-- CreateTable
CREATE TABLE "ProjectResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "projectType" TEXT NOT NULL,
    "organization" TEXT,
    "country" TEXT,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectResult_slug_key" ON "ProjectResult"("slug");
