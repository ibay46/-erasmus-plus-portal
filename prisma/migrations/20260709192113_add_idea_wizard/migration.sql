-- CreateTable
CREATE TABLE "IdeaWizardSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Adsız Proje Fikri',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdeaWizardSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaWizardStep" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "stepKey" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdeaWizardStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IdeaWizardSession_userId_idx" ON "IdeaWizardSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "IdeaWizardStep_sessionId_stepKey_key" ON "IdeaWizardStep"("sessionId", "stepKey");

-- AddForeignKey
ALTER TABLE "IdeaWizardSession" ADD CONSTRAINT "IdeaWizardSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaWizardStep" ADD CONSTRAINT "IdeaWizardStep_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "IdeaWizardSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
