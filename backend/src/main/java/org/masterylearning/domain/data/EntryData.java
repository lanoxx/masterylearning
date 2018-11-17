package org.masterylearning.domain.data;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.masterylearning.domain.Entry;
import org.masterylearning.dto.out.EntryDataOutDto;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToOne;

/**
 * For use of JsonTypeInfo and JsonSubType see this stackoverflow answer:
 * http://stackoverflow.com/questions/6542833/how-can-i-polymorphic-deserialization-json-string-using-java-and-jackson-library
 */
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type")
@JsonSubTypes({
        @Type(value = Section.class, name = "section"),
        @Type(value = Unit.class, name = "unit"),
        @Type(value = Paragraph.class, name = "paragraph"),
        @Type(value = ContinueButton.class, name = "continue-button"),
        @Type(value = InteractiveContent.class, name = "interactive-content"),
        @Type(value = YesNoExercise.class, name = "yesnoexercise"),
        @Type(value = MultiAnswerExercise.class, name = "multianswerexercise")
})
@Entity (name = "EntryData")
@Inheritance (strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class EntryData {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    public Long id;

    public String type;

    @JsonBackReference("entry-data")
    @OneToOne
    public Entry container;

    public abstract EntryDataOutDto toDto ();
}
