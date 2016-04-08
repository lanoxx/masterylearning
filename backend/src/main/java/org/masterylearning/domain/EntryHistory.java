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
    Long id;

    @OneToOne
    Course course;

    @OneToOne
    Entry entry;

    @Type (type = "text")
    String state;
}
