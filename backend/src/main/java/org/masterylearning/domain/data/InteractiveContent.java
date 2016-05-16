package org.masterylearning.domain.data;

import org.hibernate.annotations.Type;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.dto.out.data.InteractiveContentOutDto;

import javax.persistence.Entity;

/**
 */
@Entity (name = "InteractiveContent")
public class InteractiveContent extends EntryData {

    @Type (type = "text")
    public String initData;

    public String init;

    public InteractiveContent () {
        this.type = "interactive-content";
    }

    @Override
    public EntryDataOutDto toDto () {
        return new InteractiveContentOutDto (this);
    }
}
