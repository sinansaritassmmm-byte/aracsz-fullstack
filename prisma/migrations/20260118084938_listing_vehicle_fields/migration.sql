-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "vehicleFuel" TEXT,
ADD COLUMN     "vehicleGear" TEXT,
ADD COLUMN     "vehicleKm" INTEGER,
ADD COLUMN     "vehicleYear" INTEGER;

-- CreateIndex
CREATE INDEX "Listing_vehicleYear_idx" ON "Listing"("vehicleYear");

-- CreateIndex
CREATE INDEX "Listing_vehicleFuel_idx" ON "Listing"("vehicleFuel");

-- CreateIndex
CREATE INDEX "Listing_vehicleGear_idx" ON "Listing"("vehicleGear");
