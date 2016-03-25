package org.masterylearning.repository;

import org.masterylearning.domain.data.EntryData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntryDataRepository extends JpaRepository<EntryData, Long> {
}
