ALTER TABLE `role` MODIFY COLUMN `name` varchar(255) NOT NULL;
ALTER TABLE `role` ADD CONSTRAINT UNIQUE KEY `UK_8sewwnpamngi6b1dwaa88askk` (`name`);
