package org.masterylearning.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

/**
 *
 */
@Entity(name = "LoginHistory")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(optional = false)
    public User user;

    public LocalDateTime authenticationTime;

    public LoginHistory () { }

    public LoginHistory (User user) {
        this.user = user;

        this.authenticationTime = LocalDateTime.now ();
    }
}
