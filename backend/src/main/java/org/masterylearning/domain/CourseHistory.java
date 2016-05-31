package org.masterylearning.domain;

import org.hibernate.annotations.Type;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.time.LocalDateTime;
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

    @ManyToOne (optional = false)
    public Course course;

    @ManyToOne (optional = false)
    public Entry lastEntry;

    @Type(type = "localDateTimeType")
    public LocalDateTime created;

    @Type (type = "localDateTimeType")
    public LocalDateTime modified;

    @OneToMany (mappedBy = "courseHistory", cascade = CascadeType.PERSIST)
    public List<EntryHistory> entryHistoryList = new ArrayList<> ();

    public List<EntryHistory> getEntryHistoryList () {
        return entryHistoryList;
    }
}
