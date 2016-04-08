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
    Long id;

    @OneToOne
    Course course;

    @OneToOne
    Entry lastEntry;

    @OneToMany (cascade = CascadeType.PERSIST)
    List<EntryHistory> entryHistoryList = new ArrayList<> ();
}
