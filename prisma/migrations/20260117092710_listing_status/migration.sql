/*
  Warnings:

  - You are about to drop the column `location` on the `Listing` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "location",
ADD COLUMN     "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
ALTER COLUMN "price" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Listing_userId_idx" ON "Listing"("userId");

-- CreateIndex
CREATE INDEX "Listing_status_idx" ON "Listing"("status");
