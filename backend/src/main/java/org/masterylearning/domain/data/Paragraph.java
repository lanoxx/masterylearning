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

    @Override
    public EntryDataOutDto toDto () {
        return new ParagraphDto (this);
    }
}
