-- CreateTable
CREATE TABLE "ToolVisibility" (
    "id" TEXT NOT NULL,
    "toolKey" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolVisibility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ToolVisibility_toolKey_key" ON "ToolVisibility"("toolKey");
