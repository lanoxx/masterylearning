package org.masterylearning.domain;

import org.hibernate.annotations.Type;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

/**
 */
@Entity
public class EntryHistory {

    @Id
    @GeneratedValue
    public Long id;

    @OneToOne
    public Course course;

    @OneToOne
    public Entry entry;

    @Type (type = "text")
    public String state;
}
