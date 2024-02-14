-- AlterTable
ALTER TABLE `activity` MODIFY `thumbnailPicture` TEXT NULL,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `activityStartTime` TIME NOT NULL,
    MODIFY `activityEndTime` TIME NOT NULL;

-- AlterTable
ALTER TABLE `activitylocation` MODIFY `formattedAddress` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `activityreview` MODIFY `loved` TEXT NOT NULL,
    MODIFY `improvements` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `admin` MODIFY `password` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `parent` MODIFY `profilePicture` TEXT NULL,
    MODIFY `address` TEXT NULL;
