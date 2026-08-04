/*
  Warnings:

  - The values [declined] on the enum `orders_Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `Status` ENUM('pending', 'working_on_it', 'on_the_way', 'delivered', 'canceled') NOT NULL DEFAULT 'pending';
