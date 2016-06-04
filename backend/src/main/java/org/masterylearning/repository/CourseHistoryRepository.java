package org.masterylearning.repository;

import org.masterylearning.domain.CourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 */
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long> {

    List<CourseHistory> findByCourse_Id (Long courseId);
}
