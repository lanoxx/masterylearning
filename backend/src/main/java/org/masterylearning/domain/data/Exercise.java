package org.masterylearning.domain.data;

import org.masterylearning.domain.Entry;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToOne;

/**
 * For use of JsonTypeInfo and JsonSubType see this stackoverflow answer:
 * http://stackoverflow.com/questions/6542833/how-can-i-polymorphic-deserialization-json-string-using-java-and-jackson-library
 */
@Entity (name = "Exercise")
@Inheritance (strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Exercise extends EntryData {

    @OneToOne(cascade = CascadeType.PERSIST)
    public Entry correct;

    @OneToOne (cascade = CascadeType.PERSIST)
    public Entry incorrect;
}
