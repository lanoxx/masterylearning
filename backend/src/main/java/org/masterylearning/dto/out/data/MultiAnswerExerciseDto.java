package org.masterylearning.dto.out.data;

import org.masterylearning.domain.data.MultiAnswerExercise;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 */
public class MultiAnswerExerciseDto extends ExerciseDto {
    public String title;
    public String text;
    public List<AnswerCandidateDto> answerCandidates = new ArrayList<> ();

    public MultiAnswerExerciseDto () { }

    public MultiAnswerExerciseDto (MultiAnswerExercise data) {

        super (data);

        this.title = data.title;
        this.text = data.text;

        this.answerCandidates.addAll (data.answerCandidates.stream ().map (AnswerCandidateDto::new).collect (Collectors.toList ()));
    }
}
