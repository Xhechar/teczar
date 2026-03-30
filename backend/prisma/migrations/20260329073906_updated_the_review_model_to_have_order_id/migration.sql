/*
  Warnings:

  - Added the required column `OrderId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "OrderId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES "Order"("OrderId") ON DELETE NO ACTION ON UPDATE NO ACTION;
