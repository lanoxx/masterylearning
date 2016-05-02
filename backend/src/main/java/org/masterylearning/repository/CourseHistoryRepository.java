package org.masterylearning.repository;

import org.masterylearning.domain.CourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 */
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long> {
}
