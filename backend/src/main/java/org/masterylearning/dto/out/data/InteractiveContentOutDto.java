package org.masterylearning.dto.out.data;

import org.masterylearning.domain.data.InteractiveContent;
import org.masterylearning.dto.out.EntryDataOutDto;

/**
 */
public class InteractiveContentOutDto extends EntryDataOutDto {

    public String initData;
    public String init;

    public InteractiveContentOutDto (InteractiveContent interactiveContent) {

        super(interactiveContent);

        this.initData = interactiveContent.initData;
        this.init = interactiveContent.init;
    }
}
