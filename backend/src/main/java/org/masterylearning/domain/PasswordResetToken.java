package org.masterylearning.domain;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAmount;

import static java.time.temporal.ChronoUnit.MINUTES;

/**
 * The source of this class is:
 * http://www.baeldung.com/spring-security-registration-i-forgot-my-password
 */
@Entity
public class PasswordResetToken {

    private static final int EXPIRATION = 60 * 24;

    public static final
    TemporalAmount VALID_DURATION
            = Duration.ZERO.plus (EXPIRATION, MINUTES);

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    public String token;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    public User user;

    public LocalDateTime expiryDate;
}
