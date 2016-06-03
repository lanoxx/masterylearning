package org.masterylearning.repository;

import org.masterylearning.domain.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long> {

    Long countByRootCourse_Id (Long courseId);

}
