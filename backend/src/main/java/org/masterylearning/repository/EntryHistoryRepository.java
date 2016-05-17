package org.masterylearning.repository;

import org.masterylearning.domain.EntryHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 */
@Repository
public interface EntryHistoryRepository extends JpaRepository<EntryHistory, Long> {

    EntryHistory findByEntry_Id (Long entryId);
}
