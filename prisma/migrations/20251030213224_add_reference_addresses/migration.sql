-- CreateTable
CREATE TABLE "reference_addresses" (
    "id" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "similarAddresses" JSONB,

    CONSTRAINT "reference_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reference_addresses_pincode_idx" ON "reference_addresses"("pincode");

-- CreateIndex
CREATE INDEX "reference_addresses_zone_idx" ON "reference_addresses"("zone");
