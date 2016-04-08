package org.masterylearning.domain.data;

import org.hibernate.annotations.Type;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.dto.out.data.ParagraphDto;

import javax.persistence.Entity;

@Entity (name = "Paragraph")
public class Paragraph extends EntryData {
    public int number;
    public String title;

    @Type(type = "text")
    public String text;

    public String paragraphType;

    public Paragraph () {
        this.type = "paragraph";
    }

    /* Supported modes are 'math' and 'text'. This defines if the text field is to be rendered
     * in math mode or normal html mode.
     */
    public String mode;

    @Override
    public EntryDataOutDto toDto () {
        return new ParagraphDto (this);
    }
}
