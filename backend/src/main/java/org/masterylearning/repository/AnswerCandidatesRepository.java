package org.masterylearning.repository;

import org.masterylearning.domain.data.AnswerCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 */
@Repository
public interface AnswerCandidatesRepository extends JpaRepository<AnswerCandidate, Long> {
}
