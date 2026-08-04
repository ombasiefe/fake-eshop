-- AlterTable
ALTER TABLE `order` ADD COLUMN `Status` ENUM('pending', 'working_on_it', 'on_the_way', 'delivered', 'declined') NOT NULL DEFAULT 'pending';
