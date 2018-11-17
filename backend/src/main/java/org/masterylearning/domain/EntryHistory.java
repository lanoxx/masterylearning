package org.masterylearning.domain;

import org.hibernate.annotations.Type;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

/**
 */
@Entity
public class EntryHistory {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne (optional = false)
    public CourseHistory courseHistory;

    @ManyToOne (optional = false)
    public User user;

    @ManyToOne (optional = false)
    public Course course;

    @ManyToOne (optional = false)
    public Entry entry;

    public LocalDateTime created;

    public LocalDateTime modified;

    @Type (type = "text")
    public String state;
}
