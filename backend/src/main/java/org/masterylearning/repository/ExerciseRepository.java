package org.masterylearning.repository;

import org.masterylearning.domain.data.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 */
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
}
