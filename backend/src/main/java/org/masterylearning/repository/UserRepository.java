package org.masterylearning.repository;

import org.masterylearning.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User getUserByUsername (String username);

    User getUserByEmail (String email);
}
