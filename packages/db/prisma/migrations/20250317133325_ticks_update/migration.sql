/*
  Warnings:

  - You are about to drop the column `timestamp` on the `WebSiteTicks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WebSiteTicks" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
