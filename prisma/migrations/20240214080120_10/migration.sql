-- AddForeignKey
ALTER TABLE `ActivityReview` ADD CONSTRAINT `ActivityReview_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Parent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
