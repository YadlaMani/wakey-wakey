/*
  Warnings:

  - The `history` column on the `Validator` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Validator" DROP COLUMN "history",
ADD COLUMN     "history" JSONB NOT NULL DEFAULT '[]';
