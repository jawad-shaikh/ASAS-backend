/*
  Warnings:

  - You are about to drop the column `isApproved` on the `activityprovider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `activityprovider` DROP COLUMN `isApproved`,
    ADD COLUMN `approvalStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
