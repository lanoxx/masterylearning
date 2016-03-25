package org.masterylearning.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.masterylearning.domain.data.EntryData;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity (name = "Course")
public class Course implements Container<Entry> {

    @Id
    @GeneratedValue
    public Long id;

    public String title;
    public String period;
    public String description;

    @JsonManagedReference ("course-child")
    @OneToMany (mappedBy = "course", cascade = CascadeType.PERSIST)
    public List<Entry> children = new ArrayList<>();

    @Override
    public List<Entry> getChildren () {
        return children;
    }

    @Override
    public Entry next () {
        if (children.size () > 0)
            return children.get (0);

        return null;
    }

    @Override
    public Entry nextUpwards () {
        return null;
    }

    @Override
    public boolean hasNext () {
        return children.size () > 0;
    }

    @Override
    public Entry nextSibling () {
        return null;
    }

    @Override
    public boolean hasNextSibling () {
        return false;
    }

    /**
     *
     * @param entryData
     */
    public Entry insert (EntryData entryData) {
        Entry entry = new Entry(entryData);

        entry.course = this;
        entry.index = this.children.size ();
        entry.depth = 0;
        this.children.add (entry);

        entryData.container = entry;

        return entry;
    }
}
