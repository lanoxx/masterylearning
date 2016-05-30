INSERT INTO role (id, description, name) VALUES (
  1,
  'This role identifies students and its the default role given to new users.',
  'STUDENT'
);

INSERT INTO role (id, description, name) VALUES (
  2,
  'This role identifies teachers and gives access to teacher related tasks such as managing courses and viewing course statistics.',
  'TEACHER'
);

INSERT INTO role (id, description, name) VALUES (
  3,
  'This role identifies admins and gives access to user management and other sensitive tasks that only administrators should perform.',
  'ADMIN'
);
