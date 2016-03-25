package org.masterylearning.dto.out.data;

import org.masterylearning.domain.data.YesNoExercise;

/**
 */
public class YesNoExerciseDto extends ExerciseDto {
    public String title;
    public String text;
    public boolean answer;

    public YesNoExerciseDto () { }

    public YesNoExerciseDto (YesNoExercise data) {

        super (data);

        this.title = data.title;
        this.text = data.text;
        this.answer = data.answer;
    }


}
