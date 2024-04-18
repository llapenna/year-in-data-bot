/*
  Warnings:

  - You are about to drop the column `cryCount` on the `Data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Data" DROP COLUMN "cryCount",
ADD COLUMN     "didCry" BOOLEAN;
