# We temporarily drop the two foreign, so that we can
ALTER TABLE `course_history` DROP FOREIGN KEY `FK_apcg5jt0436axkbtlao94689y`;
ALTER TABLE `course_history` DROP FOREIGN KEY `FK_b8mpbke0nvcw9w9sefqhsi95d`;

# These two unique constraints
ALTER TABLE `course_history` DROP KEY `UK_b8mpbke0nvcw9w9sefqhsi95d`;
ALTER TABLE `course_history` DROP KEY `UK_apcg5jt0436axkbtlao94689y`;

# And replace them by non unique keys
ALTER TABLE `course_history` ADD KEY `FK_apcg5jt0436axkbtlao94689y` (`course_id`);
ALTER TABLE `course_history` ADD KEY `FK_b8mpbke0nvcw9w9sefqhsi95d` (`last_entry_id`);

# And last, add back the foreign key constraints
ALTER TABLE `course_history`
  ADD CONSTRAINT `FK_apcg5jt0436axkbtlao94689y` FOREIGN KEY (`course_id`) REFERENCES course (id);

ALTER TABLE `course_history`
  ADD CONSTRAINT `FK_b8mpbke0nvcw9w9sefqhsi95d` FOREIGN KEY (`last_entry_id`) REFERENCES entry (id);
