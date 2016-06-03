package org.masterylearning.dto.out;

import org.masterylearning.domain.view.HistoryEntriesPerUser;

import java.util.ArrayList;
import java.util.List;

/**
 */
public class CourseStatisticsOutDto {

    public String message;

    public Long courseId;
    public Long entryCount;

    public List<HistoryEntriesPerUser> historyEntriesPerUsers = new ArrayList<> ();

    public CourseStatisticsOutDto () { }

    public CourseStatisticsOutDto (Long courseId) {
        this.courseId = courseId;
    }
}
