-- AlterTable: prices become decimal and carry their own currency (COP or USD).
ALTER TABLE "catalog_products" ADD COLUMN "price" DECIMAL(14,2),
ADD COLUMN "priceCurrency" TEXT NOT NULL DEFAULT 'COP';

-- Existing prices were integer COP.
UPDATE "catalog_products" SET "price" = "priceCop";

-- AlterTable
ALTER TABLE "catalog_products" DROP COLUMN "priceCop";
