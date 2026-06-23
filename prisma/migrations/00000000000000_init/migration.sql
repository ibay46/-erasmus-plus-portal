-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('FREE', 'STANDARD', 'PREMIUM', 'ADMIN');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('YENI_CAGRI', 'ULUSAL_AJANS', 'AVRUPA_KOMISYONU', 'SALTO_YOUTH', 'SALTO_EDUCATION_TRAINING', 'GENEL');

-- CreateEnum
CREATE TYPE "IlanType" AS ENUM ('PARTNER_ARIYORUM', 'PROJE_FIKRIM_VAR', 'KONSORSIYUM_KURUYORUM');

-- CreateEnum
CREATE TYPE "OrgType" AS ENUM ('OKUL', 'BELEDIYE', 'STK', 'UNIVERSITE', 'DIGER');

-- CreateEnum
CREATE TYPE "IlanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "membershipTier" "MembershipTier" NOT NULL DEFAULT 'FREE',
    "membershipExpiresAt" TIMESTAMP(3),
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "category" "PostCategory" NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantProject" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrantProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectResult" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "projectType" TEXT NOT NULL,
    "country" TEXT,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLibraryEntry" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "themes" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "workPackages" TEXT NOT NULL,
    "dissemination" TEXT NOT NULL,
    "budgetLogic" TEXT NOT NULL,
    "isPremiumOnly" BOOLEAN NOT NULL DEFAULT false,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectLibraryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolSubmission" (
    "id" TEXT NOT NULL,
    "toolKey" TEXT NOT NULL,
    "userId" TEXT,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ilan" (
    "id" TEXT NOT NULL,
    "type" "IlanType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "country" TEXT,
    "organization" TEXT,
    "orgType" "OrgType",
    "contactEmail" TEXT NOT NULL,
    "userId" TEXT,
    "status" "IlanStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "Ilan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultingLead" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "budgetRange" TEXT,
    "userId" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultingLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GrantProject_slug_key" ON "GrantProject"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectResult_slug_key" ON "ProjectResult"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectLibraryEntry_slug_key" ON "ProjectLibraryEntry"("slug");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolSubmission" ADD CONSTRAINT "ToolSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ilan" ADD CONSTRAINT "Ilan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultingLead" ADD CONSTRAINT "ConsultingLead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

