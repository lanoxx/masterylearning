package org.masterylearning.domain;

import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created by sebastiangeiger on 8/03/16.
 */
@Entity
public class Role {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true)
    public String name;

    @Type(type = "text")
    public String description;

    public Role () { }

    public Role (String name, String description) {
        this.name = name;
        this.description = description;
    }
}
