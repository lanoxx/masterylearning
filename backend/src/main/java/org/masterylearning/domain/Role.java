package org.masterylearning.domain;

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

    public String description;
}
