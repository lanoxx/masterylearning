package org.masterylearning.repository;

import org.masterylearning.domain.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 */
@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {

    LoginHistory findFirstByOrderByAuthenticationTimeDesc();
}
