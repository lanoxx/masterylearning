package org.masterylearning.domain.data;

import org.hibernate.annotations.Type;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.dto.out.data.SectionDto;

import javax.persistence.Entity;

@Entity (name = "Section")
public class Section extends EntryData {
    public String title;

    @Type(type = "text")
    public String description;

    public Section () {
        this.type = "section";
    }

    public Section (String title) {
        this();
        this.title = title;
    }

    @Override
    public EntryDataOutDto toDto () {
        return new SectionDto (this);
    }
}
