CREATE TABLE answer_candidate (
  id      BIGINT NOT NULL AUTO_INCREMENT,
  correct BIT    NOT NULL,
  text    LONGTEXT,
  PRIMARY KEY (id)
);
CREATE TABLE continue_button (
  id           BIGINT NOT NULL,
  type         VARCHAR(255),
  container_id BIGINT,
  PRIMARY KEY (id)
);
CREATE TABLE course (
  id          BIGINT NOT NULL AUTO_INCREMENT,
  description VARCHAR(255),
  period      VARCHAR(255),
  title       VARCHAR(255),
  PRIMARY KEY (id)
);
CREATE TABLE course_history (
  id            BIGINT NOT NULL AUTO_INCREMENT,
  created       DATETIME,
  modified      DATETIME,
  course_id     BIGINT NOT NULL,
  last_entry_id BIGINT NOT NULL,
  user_id       BIGINT NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE entry (
  id             BIGINT  NOT NULL AUTO_INCREMENT,
  depth          INTEGER NOT NULL,
  `index`        INTEGER,
  course_id      BIGINT,
  parent_id      BIGINT,
  root_course_id BIGINT,
  PRIMARY KEY (id)
);
CREATE TABLE entry_history (
  id                BIGINT NOT NULL AUTO_INCREMENT,
  created           DATETIME,
  modified          DATETIME,
  state             LONGTEXT,
  course_id         BIGINT NOT NULL,
  course_history_id BIGINT NOT NULL,
  entry_id          BIGINT NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE interactive_content (
  id           BIGINT NOT NULL,
  type         VARCHAR(255),
  container_id BIGINT,
  init         VARCHAR(255),
  init_data    LONGTEXT,
  PRIMARY KEY (id)
);
CREATE TABLE multi_answer_exercise (
  id           BIGINT NOT NULL,
  type         VARCHAR(255),
  container_id BIGINT,
  correct_id   BIGINT,
  incorrect_id BIGINT,
  text         LONGTEXT,
  title        VARCHAR(255),
  PRIMARY KEY (id)
);
CREATE TABLE multi_answer_exercise_answer_candidates (
  multi_answer_exercise_id BIGINT NOT NULL,
  answer_candidates_id     BIGINT NOT NULL
);
CREATE TABLE paragraph (
  id             BIGINT  NOT NULL,
  type           VARCHAR(255),
  container_id   BIGINT,
  mode           VARCHAR(255),
  number         INTEGER NOT NULL,
  paragraph_type VARCHAR(255),
  text           LONGTEXT,
  title          VARCHAR(255),
  PRIMARY KEY (id)
);
CREATE TABLE password_reset_token (
  id          BIGINT NOT NULL AUTO_INCREMENT,
  expiry_date DATETIME,
  token       VARCHAR(255),
  user_id     BIGINT NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE role (
  id          BIGINT NOT NULL AUTO_INCREMENT,
  description LONGTEXT,
  name        VARCHAR(255),
  PRIMARY KEY (id)
);
CREATE TABLE section (
  id           BIGINT NOT NULL,
  type         VARCHAR(255),
  container_id BIGINT,
  description  LONGTEXT,
  title        VARCHAR(255),
  PRIMARY KEY (id)
);
CREATE TABLE unit (
  id               BIGINT NOT NULL,
  type             VARCHAR(255),
  container_id     BIGINT,
  breadcrumb_title VARCHAR(255),
  description      VARCHAR(255),
  full_title       VARCHAR(255),
  next_unit_id     BIGINT,
  prev_unit_id     BIGINT,
  PRIMARY KEY (id)
);
CREATE TABLE user (
  id       BIGINT       NOT NULL AUTO_INCREMENT,
  email    VARCHAR(255) NOT NULL,
  fullname VARCHAR(255),
  mode     VARCHAR(255),
  password VARCHAR(255),
  username VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE user_roles (
  user_id  BIGINT NOT NULL,
  roles_id BIGINT NOT NULL
);
CREATE TABLE yes_no_exercise (
  id           BIGINT NOT NULL,
  type         VARCHAR(255),
  container_id BIGINT,
  correct_id   BIGINT,
  incorrect_id BIGINT,
  answer       BIT    NOT NULL,
  text         LONGTEXT,
  title        VARCHAR(255),
  PRIMARY KEY (id)
);

ALTER TABLE course_history
  ADD CONSTRAINT UK_apcg5jt0436axkbtlao94689y UNIQUE (course_id);
ALTER TABLE course_history
  ADD CONSTRAINT UK_b8mpbke0nvcw9w9sefqhsi95d UNIQUE (last_entry_id);
ALTER TABLE multi_answer_exercise_answer_candidates
  ADD CONSTRAINT UK_8fmx1r3iq4uc2v6bcchec2936 UNIQUE (answer_candidates_id);
ALTER TABLE user
  ADD CONSTRAINT UK_ob8kqyqqgmefl0aco34akdtpe UNIQUE (email);
ALTER TABLE user
  ADD CONSTRAINT UK_sb8bbouer5wak8vyiiy4pf2bx UNIQUE (username);
ALTER TABLE continue_button
  ADD CONSTRAINT FK_91kaxn0ptprwbvh5cux34vofd FOREIGN KEY (container_id) REFERENCES entry (id);
ALTER TABLE course_history
  ADD CONSTRAINT FK_apcg5jt0436axkbtlao94689y FOREIGN KEY (course_id) REFERENCES course (id);
ALTER TABLE course_history
  ADD CONSTRAINT FK_b8mpbke0nvcw9w9sefqhsi95d FOREIGN KEY (last_entry_id) REFERENCES entry (id);
ALTER TABLE course_history
  ADD CONSTRAINT FK_d499qgld6ms5uieeekrdmifk1 FOREIGN KEY (user_id) REFERENCES user (id);
ALTER TABLE entry
  ADD CONSTRAINT FK_bi5a9yyahf7svnmljk06twifs FOREIGN KEY (course_id) REFERENCES course (id);
ALTER TABLE entry
  ADD CONSTRAINT FK_m8qavdtfxyipe7b6qxy814i0t FOREIGN KEY (parent_id) REFERENCES entry (id);
ALTER TABLE entry
  ADD CONSTRAINT FK_8kcupdwtqdthkrrs0gu76kedm FOREIGN KEY (root_course_id) REFERENCES course (id);
ALTER TABLE entry_history
  ADD CONSTRAINT FK_rmlvvai9995jepco0wonnjeat FOREIGN KEY (course_id) REFERENCES course (id);
ALTER TABLE entry_history
  ADD CONSTRAINT FK_idp02ugwh2twp7dyfmw3pl9p9 FOREIGN KEY (course_history_id) REFERENCES course_history (id);
ALTER TABLE entry_history
  ADD CONSTRAINT FK_f2mu7h50hhd8dmrkyb01jpch8 FOREIGN KEY (entry_id) REFERENCES entry (id);
ALTER TABLE interactive_content
  ADD CONSTRAINT FK_8noslhbaws12ngkbh4b5d6frv FOREIGN KEY (container_id) REFERENCES entry (id);
ALTER TABLE multi_answer_exercise
  ADD CONSTRAINT FK_csv9fl5hmg3ekkpgea5aerjvj FOREIGN KEY (correct_id) REFERENCES entry (id);
ALTER TABLE multi_answer_exercise
  ADD CONSTRAINT FK_ltaqm1mqe51fcjencrb5pm0su FOREIGN KEY (incorrect_id) REFERENCES entry (id);
ALTER TABLE multi_answer_exercise
  ADD CONSTRAINT FK_letrmn0tfh43mhbj3gb7iuktc FOREIGN KEY (container_id) REFERENCES entry (id);
ALTER TABLE multi_answer_exercise_answer_candidates
  ADD CONSTRAINT FK_8fmx1r3iq4uc2v6bcchec2936 FOREIGN KEY (answer_candidates_id) REFERENCES answer_candidate (id);
ALTER TABLE multi_answer_exercise_answer_candidates
  ADD CONSTRAINT FK_k9ysmjck2xaqpaut8qen8lp5h FOREIGN KEY (multi_answer_exercise_id) REFERENCES multi_answer_exercise (id);
ALTER TABLE paragraph
  ADD CONSTRAINT FK_qae9b78lkvcb14q5looyl7vh0 FOREIGN KEY (container_id) REFERENCES entry (id);
ALTER TABLE password_reset_token
  ADD CONSTRAINT FK_f90ivichjaokvmovxpnlm5nin FOREIGN KEY (user_id) REFERENCES user (id);
ALTER TABLE section
  ADD CONSTRAINT FK_n7cunm11s7arncmega5oukv3m FOREIGN KEY (container_id) REFERENCES entry (id);
ALTER TABLE unit
  ADD CONSTRAINT FK_nxhqoy1gn5m3n5ia3gg8fb57v FOREIGN KEY (container_id) REFERENCES entry (id);
ALTER TABLE user_roles
  ADD CONSTRAINT FK_amwlmdeik2qdnksxgd566knop FOREIGN KEY (roles_id) REFERENCES role (id);
ALTER TABLE user_roles
  ADD CONSTRAINT FK_g1uebn6mqk9qiaw45vnacmyo2 FOREIGN KEY (user_id) REFERENCES user (id);
ALTER TABLE yes_no_exercise
  ADD CONSTRAINT FK_fuvtsqicutwrjnldglr2anqwv FOREIGN KEY (correct_id) REFERENCES entry (id);
ALTER TABLE yes_no_exercise
  ADD CONSTRAINT FK_suc41rls2hv8dvj443b1n67uv FOREIGN KEY (incorrect_id) REFERENCES entry (id);
ALTER TABLE yes_no_exercise
  ADD CONSTRAINT FK_8yyilasxrjvv8w01gyq8nown2 FOREIGN KEY (container_id) REFERENCES entry (id);

CREATE TABLE hibernate_sequences (
  sequence_name          VARCHAR(255),
  sequence_next_hi_value INTEGER
);
