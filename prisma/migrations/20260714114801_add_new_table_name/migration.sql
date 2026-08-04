/*
  Warnings:

  - You are about to drop the column `form` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `email` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `form`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `from` VARCHAR(191) NOT NULL DEFAULT 'contact_form';
