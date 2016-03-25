package org.masterylearning.dto.out.data;

import org.masterylearning.domain.data.Section;
import org.masterylearning.dto.out.EntryDataOutDto;

/**
 */
public class SectionDto extends EntryDataOutDto {
    public String title;
    public String description;

    public SectionDto () { }

    public SectionDto (Section data) {

        super(data);

        this.title = data.title;
        this.description = data.description;
    }
}
