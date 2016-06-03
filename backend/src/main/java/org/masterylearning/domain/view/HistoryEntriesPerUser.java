package org.masterylearning.domain.view;

/**
 */
public class HistoryEntriesPerUser {
    public Long userId;
    public String fullname;
    public Long historyCount;

    public HistoryEntriesPerUser (Long userId, String fullname, Long historyCount) {
        this.userId = userId;
        this.fullname = fullname;
        this.historyCount = historyCount;
    }
}
