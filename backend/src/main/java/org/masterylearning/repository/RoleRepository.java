package org.masterylearning.repository;

import org.masterylearning.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findRoleByName(String name);
}
