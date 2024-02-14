/*
  Warnings:

  - You are about to drop the column `address` on the `activityprovider` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `activityprovider` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `activityprovider` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `activityprovider` table. All the data in the column will be lost.
  - Made the column `website` on table `activityprovider` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `activityprovider` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `state`,
    DROP COLUMN `zipCode`,
    MODIFY `website` VARCHAR(191) NOT NULL;
