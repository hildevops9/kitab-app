/*
  Warnings:

  - A unique constraint covering the columns `[kitabId,slug]` on the table `Bab` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Kitab` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Bab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Kitab` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KitabType" AS ENUM ('QURAN', 'HIKAM', 'GENERAL');

-- AlterTable
ALTER TABLE "Bab" ADD COLUMN     "arabicTitle" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Kitab" ADD COLUMN     "arabicTitle" TEXT,
ADD COLUMN     "coverColor" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "type" "KitabType" NOT NULL DEFAULT 'GENERAL';

-- CreateIndex
CREATE UNIQUE INDEX "Bab_kitabId_slug_key" ON "Bab"("kitabId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Kitab_slug_key" ON "Kitab"("slug");
