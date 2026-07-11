-- CreateTable
CREATE TABLE "ApplicationFormSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ideaWizardSessionId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Adsız Başvuru',
    "hareketlilikSayisi" INTEGER NOT NULL DEFAULT 1,
    "kurulusSayisi" INTEGER NOT NULL DEFAULT 1,
    "denetimOutput" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationFormSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationFormAnswer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "instanceIndex" INTEGER NOT NULL DEFAULT 0,
    "answer" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationFormAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationFormSession_userId_idx" ON "ApplicationFormSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationFormAnswer_sessionId_questionId_instanceIndex_key" ON "ApplicationFormAnswer"("sessionId", "questionId", "instanceIndex");

-- AddForeignKey
ALTER TABLE "ApplicationFormSession" ADD CONSTRAINT "ApplicationFormSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationFormSession" ADD CONSTRAINT "ApplicationFormSession_ideaWizardSessionId_fkey" FOREIGN KEY ("ideaWizardSessionId") REFERENCES "IdeaWizardSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationFormAnswer" ADD CONSTRAINT "ApplicationFormAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ApplicationFormSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
