package org.masterylearning.dto.out;

import org.masterylearning.domain.EntryHistory;

/**
 */
public class EntryHistoryDto {

    public Long courseId;
    public Long entryId;
    public String state;

    public EntryHistoryDto (EntryHistory entryHistory) {
        this.courseId = entryHistory.course.id;
        this.entryId = entryHistory.entry.id;
        this.state = entryHistory.state;
    }
}
