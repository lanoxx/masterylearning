package org.masterylearning.dto.out;

import org.masterylearning.domain.data.EntryData;

/**
 */
public class EntryDataOutDto {
    public Long id;
    public Long parent;

    public int depth;
    public int index;
    public String type;

    public EntryDataOutDto () {}

    public EntryDataOutDto (EntryData data) {
        this.id = data.id;

        if (data.container != null) {
            if (data.container.parent != null) {
                this.parent = data.container.parent.id;
            }

            this.depth = data.container.depth;
            this.index = data.container.index;
        }

        this.type = data.type;
    }


}
