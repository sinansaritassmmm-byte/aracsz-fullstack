-- DropIndex
DROP INDEX "Listing_userId_idx";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "categoryMain" TEXT,
ADD COLUMN     "categorySub" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "modelName" TEXT;

-- CreateIndex
CREATE INDEX "Listing_categoryMain_idx" ON "Listing"("categoryMain");

-- CreateIndex
CREATE INDEX "Listing_categorySub_idx" ON "Listing"("categorySub");

-- CreateIndex
CREATE INDEX "Listing_brand_idx" ON "Listing"("brand");

-- CreateIndex
CREATE INDEX "Listing_city_district_idx" ON "Listing"("city", "district");
