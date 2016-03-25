package org.masterylearning.domain.data;


import org.hibernate.annotations.Type;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.dto.out.data.MultiAnswerExerciseDto;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import java.util.List;

@Entity (name = "MultiAnswerExercise")
public class MultiAnswerExercise extends Exercise {

    public String title;

    @Type(type = "text")
    public String text;
    public boolean blocks;

    @ElementCollection
    public List<AnswerCandidate> answerCandidates;

    public MultiAnswerExercise () {
        this.exerciseType = "multianswerexercise";
    }

    @Override
    public EntryDataOutDto toDto () {
        return new MultiAnswerExerciseDto (this);
    }
}
