package org.masterylearning.domain.data;

import org.hibernate.annotations.Type;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.dto.out.data.YesNoExerciseDto;

import javax.persistence.Entity;

@Entity (name = "YesNoExercise")
public class YesNoExercise extends Exercise {
    public String title;

    @Type(type = "text")
    public String text;
    public boolean answer;

    public YesNoExercise () {
        this.exerciseType = "yesnoexercise";
    }

    @Override
    public EntryDataOutDto toDto () {
        return new YesNoExerciseDto (this);
    }
}
