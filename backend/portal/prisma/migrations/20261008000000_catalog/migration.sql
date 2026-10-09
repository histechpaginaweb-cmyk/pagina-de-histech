-- CreateEnum
CREATE TYPE "CatalogAvailability" AS ENUM ('in_stock', 'on_request', 'out_of_stock');

-- CreateEnum
CREATE TYPE "CatalogStatus" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "catalog_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_brands" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "brandId" TEXT,
    "model" TEXT,
    "sku" TEXT,
    "shortDescription" TEXT,
    "description" TEXT,
    "specs" JSONB NOT NULL DEFAULT '[]',
    "images" JSONB NOT NULL DEFAULT '[]',
    "datasheetUrl" TEXT,
    "priceCop" INTEGER,
    "consultPrice" BOOLEAN NOT NULL DEFAULT false,
    "availability" "CatalogAvailability" NOT NULL DEFAULT 'on_request',
    "priceUpdatedAt" TIMESTAMP(3),
    "status" "CatalogStatus" NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_settings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "showPrices" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalog_categories_slug_key" ON "catalog_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_brands_slug_key" ON "catalog_brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_products_slug_key" ON "catalog_products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_products_sku_key" ON "catalog_products"("sku");

-- CreateIndex
CREATE INDEX "catalog_products_status_idx" ON "catalog_products"("status");

-- CreateIndex
CREATE INDEX "catalog_products_categoryId_idx" ON "catalog_products"("categoryId");

-- CreateIndex
CREATE INDEX "catalog_products_brandId_idx" ON "catalog_products"("brandId");

-- CreateIndex
CREATE INDEX "catalog_products_featured_idx" ON "catalog_products"("featured");

-- AddForeignKey
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "catalog_brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

