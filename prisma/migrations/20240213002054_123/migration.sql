/*
  Warnings:

  - You are about to drop the column `categoryId` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_categoryId_fkey`;

-- AlterTable
ALTER TABLE `activity` DROP COLUMN `categoryId`,
    ADD COLUMN `category` ENUM('MUSIC', 'ART', 'COOKING', 'ROBOTS', 'LANGUAGE', 'SPORTS') NOT NULL;

-- DropTable
DROP TABLE `category`;
