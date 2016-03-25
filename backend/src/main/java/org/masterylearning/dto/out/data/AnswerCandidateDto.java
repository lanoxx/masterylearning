package org.masterylearning.dto.out.data;

import org.masterylearning.domain.data.AnswerCandidate;

/**
 */
public class AnswerCandidateDto {
    public Long id;
    public String text;
    public boolean correct;

    public AnswerCandidateDto () { }

    public AnswerCandidateDto (AnswerCandidate data) {
        this.id = data.id;
        this.text = data.text;
        this.correct = data.correct;
    }
}
