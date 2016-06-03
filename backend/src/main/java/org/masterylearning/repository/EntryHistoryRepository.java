package org.masterylearning.repository;

import org.masterylearning.domain.EntryHistory;
import org.masterylearning.domain.view.HistoryEntriesPerUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 */
@Repository
public interface EntryHistoryRepository extends JpaRepository<EntryHistory, Long> {

    @Query(value = "" +
            "select new org.masterylearning.domain.view.HistoryEntriesPerUser (" +
            "    user.id, " +
            "    entryHistory.user.fullname, " +
            "    count (entryHistory.user)) " +
            "from org.masterylearning.domain.EntryHistory entryHistory " +
            "right join entryHistory.user user " +
            "where entryHistory.course is empty or entryHistory.course.id = :courseId " +
            "group by user.id")
    List<HistoryEntriesPerUser> getEntryCountByUserForCourse (@Param ("courseId") Long courseId);

}
