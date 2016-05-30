package org.masterylearning.domain;

import org.hibernate.annotations.Type;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by sebastiangeiger on 8/03/16.
 */
@Entity
public class Role {
    @Id
    @GeneratedValue
    public Long id;

    public String name;

    @Type(type = "text")
    public String description;

    public Role () { }

    public Role (String name, String description) {
        this.name = name;
        this.description = description;
    }
}
