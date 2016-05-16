package org.masterylearning.domain;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
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

    @ManyToOne (optional = false)
    public User user;

    @OneToOne (optional = false)
    public Course course;

    @OneToOne (optional = false)
    public Entry lastEntry;

    @OneToMany (mappedBy = "courseHistory", cascade = CascadeType.PERSIST)
    public List<EntryHistory> entryHistoryList = new ArrayList<> ();

    public List<EntryHistory> getEntryHistoryList () {
        return entryHistoryList;
    }
}
