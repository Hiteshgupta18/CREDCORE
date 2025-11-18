-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('ACTIVE', 'UNDER_REVIEW', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('MEDICAL_LICENSE', 'BOARD_CERTIFICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "DiscrepancyStatus" AS ENUM ('PENDING_REVIEW', 'AUTO_UPDATED', 'DISMISSED');

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "npi" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "overallTrustScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastVerifiedAt" TIMESTAMP(3),
    "status" "ProviderStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "phone" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "number" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_scraped_data" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawJson" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raw_scraped_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discrepancy_logs" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "currentValue" TEXT NOT NULL,
    "newFoundValue" TEXT NOT NULL,
    "aiConfidenceScore" DOUBLE PRECISION NOT NULL,
    "status" "DiscrepancyStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discrepancy_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_npi_key" ON "providers"("npi");

-- CreateIndex
CREATE INDEX "providers_npi_idx" ON "providers"("npi");

-- CreateIndex
CREATE INDEX "locations_providerId_idx" ON "locations"("providerId");

-- CreateIndex
CREATE INDEX "credentials_providerId_idx" ON "credentials"("providerId");

-- CreateIndex
CREATE INDEX "discrepancy_logs_providerId_idx" ON "discrepancy_logs"("providerId");

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discrepancy_logs" ADD CONSTRAINT "discrepancy_logs_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
