package org.masterylearning.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class User {

    @Id
    @GeneratedValue
    public Long id;

    @Column(nullable = false, unique = true)
    public String username;

    public String password;

    protected User () { }

    public User(String username, String password)
    {
        this.username = username;
        this.password = password;
    }

    //public List<Role> roles;
}
