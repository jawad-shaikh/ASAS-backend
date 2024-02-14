/*
  Warnings:

  - You are about to drop the `activitylocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activityprice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `formattedAddress` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationLatitude` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationLongitude` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activitylocation` DROP FOREIGN KEY `ActivityLocation_activityId_fkey`;

-- DropForeignKey
ALTER TABLE `activityprice` DROP FOREIGN KEY `ActivityPrice_activityId_fkey`;

-- AlterTable
ALTER TABLE `activity` ADD COLUMN `formattedAddress` TEXT NOT NULL,
    ADD COLUMN `fullCoursePrice` DOUBLE NULL,
    ADD COLUMN `isFullCourse` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isSingleSession` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `locationLatitude` DOUBLE NOT NULL,
    ADD COLUMN `locationLongitude` DOUBLE NOT NULL,
    ADD COLUMN `singleSessionPrice` DOUBLE NULL;

-- DropTable
DROP TABLE `activitylocation`;

-- DropTable
DROP TABLE `activityprice`;
