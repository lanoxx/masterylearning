begin;

SET FOREIGN_KEY_CHECKS=0;

alter table `hibernate_sequences`
      change column `sequence_next_hi_value` `next_val` bigint;

alter table `hibernate_sequences`
      alter column `sequence_name` drop default;

alter table `hibernate_sequences`
      add constraint primary key (`sequence_name`);

SET FOREIGN_KEY_CHECKS=1;

commit;
