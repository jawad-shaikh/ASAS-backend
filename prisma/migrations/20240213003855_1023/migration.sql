/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `AcitivityProvider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AcitivityProvider_email_key` ON `AcitivityProvider`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Parent_email_key` ON `Parent`(`email`);
