package org.masterylearning.repository;

import org.masterylearning.domain.EntryHistory;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 */
public interface EntryHistoryRepository extends JpaRepository<EntryHistory, Long> {
}
