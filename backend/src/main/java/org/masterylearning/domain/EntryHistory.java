package org.masterylearning.domain;

import org.hibernate.annotations.Type;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

/**
 */
@Entity
public class EntryHistory {

    @Id
    @GeneratedValue
    public Long id;

    @ManyToOne (optional = false)
    public CourseHistory courseHistory;

    @ManyToOne (optional = false)
    public Course course;

    @ManyToOne (optional = false)
    public Entry entry;

    @Type (type = "localDateTimeType")
    public LocalDateTime created;

    @Type (type = "localDateTimeType")
    public LocalDateTime modified;

    @Type (type = "text")
    public String state;
}
