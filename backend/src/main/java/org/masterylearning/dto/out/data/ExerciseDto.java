package org.masterylearning.dto.out.data;

import org.masterylearning.domain.data.Exercise;
import org.masterylearning.dto.out.EntryDataOutDto;

/**
 */
public class ExerciseDto extends EntryDataOutDto {
    public String exerciseType;
    public Long correctId;
    public Long incorrectId;

    public ExerciseDto () { }

    public ExerciseDto (Exercise data) {

        super(data);

        this.exerciseType = data.exerciseType;

        if (data.correct != null) {
            this.correctId = data.correct.id;
        }

        if (data.incorrect != null) {
            this.incorrectId = data.incorrect.id;
        }


    }
}
