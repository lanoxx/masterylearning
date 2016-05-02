package org.masterylearning.domain;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.util.ArrayList;
import java.util.List;

/**
 */
@Entity
public class CourseHistory {
    @Id
    @GeneratedValue
    public Long id;

    @OneToOne
    public Course course;

    @OneToOne
    public Entry lastEntry;

    @OneToMany (cascade = CascadeType.PERSIST)
    public List<EntryHistory> entryHistoryList = new ArrayList<> ();

    public List<EntryHistory> getEntryHistoryList () {
        return entryHistoryList;
    }
}
