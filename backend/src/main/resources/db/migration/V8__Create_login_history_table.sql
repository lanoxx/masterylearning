create table login_history
(
  id                  bigint not null auto_increment,
  authentication_time datetime(6),
  user_id             bigint not null,
  primary key (id)
) engine = InnoDB;

alter table login_history
  add constraint FKnfm7i09mfh1mhw3ukr6yldq31 foreign key (user_id) references user (id);
