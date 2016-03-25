package org.masterylearning.domain.data;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.masterylearning.domain.Entry;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.dto.out.data.ExerciseDto;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToOne;

/**
 * For use of JsonTypeInfo and JsonSubType see this stackoverflow answer:
 * http://stackoverflow.com/questions/6542833/how-can-i-polymorphic-deserialization-json-string-using-java-and-jackson-library
 */
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "exerciseType")
@JsonSubTypes({
        @JsonSubTypes.Type(value = YesNoExercise.class, name = "yesnoexercise"),
        @JsonSubTypes.Type(value = MultiAnswerExercise.class, name = "multianswerexercise"),
})
@Entity (name = "Exercise")
@Inheritance (strategy = InheritanceType.TABLE_PER_CLASS)
public class Exercise extends EntryData {
    public String exerciseType;

    @OneToOne(cascade = CascadeType.PERSIST)
    public Entry correct;

    @OneToOne (cascade = CascadeType.PERSIST)
    public Entry incorrect;

    public Exercise () {
        this.type = "exercise";
    }

    @Override
    public EntryDataOutDto toDto () {
        return new ExerciseDto (this);
    }
}
