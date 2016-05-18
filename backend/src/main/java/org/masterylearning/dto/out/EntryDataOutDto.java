package org.masterylearning.dto.out;

import org.masterylearning.domain.data.EntryData;

/**
 */
public class EntryDataOutDto {
    public Long id;      //stores id of containing entry
    public Long parent;  //stores id of containing entries parent
    public Long courseId;

    public int depth;
    public int index;
    public String type;

    /**
     * This contains the entry state according to the users history
     */
    public String state;

    /**
     * Indicates to the client whether the user has seen this entry before.
     * An entry is considered seen, if it was previously loaded by the client.
     */
    public Boolean seen = false;

    public EntryDataOutDto () {}

    public EntryDataOutDto (EntryData data) {

        if (data.container != null) {
            this.id = data.container.id;
            this.courseId = data.container.getRootCourse ().id;

            if (data.container.parent != null) {
                this.parent = data.container.parent.id;
            }

            this.depth = data.container.depth;
            this.index = data.container.index;
        }

        this.type = data.type;
    }
}
