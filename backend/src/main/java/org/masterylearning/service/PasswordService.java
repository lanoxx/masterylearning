package org.masterylearning.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.masterylearning.domain.PasswordResetToken;
import org.masterylearning.domain.User;
import org.masterylearning.repository.PasswordResetTokenRepository;
import org.masterylearning.repository.UserRepository;
import org.springframework.mail.MailException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 *
 */
@Service
public class PasswordService {

    private Logger logger = LogManager.getLogger (PasswordService.class);

    @Inject EmailService emailService;
    @Inject PasswordEncoder passwordEncoder;
    @Inject UserRepository userRepository;
    @Inject UserService userService;
    @Inject PasswordResetTokenRepository resetTokenRepository;

    @Transactional
    public void sendPasswordResetEmail (String username, String hostname)
    {
        if (username == null)
        {
            throw new IllegalArgumentException ("User must not be null.");
        }

        if (hostname == null)
        {
            throw new IllegalArgumentException ("Hostname must not be null");
        }

        User user;

        if (username.contains ("@")) {
            user = userRepository.getUserByEmail (username);
        } else {
            user = userRepository.getUserByUsername (username);
        }

        if (user == null) {
            throw new UsernameNotFoundException ("No user was found for the provided username: " + username);
        }

        PasswordResetToken resetToken
                = userService.createPasswordResetToken (user);

        String subject = "Reset e-learning Password";

        // We always use a secure url here, since we have no way of detecting if the frontend server
        // is using a secure connection. Its the task of the frontend server to rewrite this if it is using
        // unsecure connections.
        String url = "https://" + hostname + "/user/password/resetToken/" + resetToken.token + "/user/" + user.id;
        String body = "Click here to rest your password for the system: " + url;

        try {
            emailService.sendEmail (user.email, subject, body);

            logger.debug ("A user reset token has been generated " +
                                  "for user '" + user.username + "' " +
                                  "and was sent to: '" + user.email + "'");

        } catch (MailException ex) {
            logger.error ("An error occurred while sending the email. " +
                                  "The password reset mail could was not sent.", ex);

            // this will rollback the token creation
            throw ex;
        }
    }

    @Transactional
    public boolean resetPassword (Long userId,
                                  String resetToken,
                                  String newPassword)
    {
        PasswordResetToken passwordResetToken = resetTokenRepository.findPasswordResetTokenByToken (resetToken);

        if (passwordResetToken == null)
        {
            return false;
        }

        boolean tokenValid = validateResetPasswordToken (userId, passwordResetToken);

        if (!tokenValid)
        {
            return false;
        }

        User user = passwordResetToken.user;
        user.password = passwordEncoder.encode (newPassword);
        userRepository.save (user);

        resetTokenRepository.delete (passwordResetToken);

        return true;
    }

    private boolean
    validateResetPasswordToken (Long userId, PasswordResetToken passwordResetToken)
    {
        if (passwordResetToken == null || passwordResetToken.expiryDate == null)
        {
            return false;
        }

        long until = LocalDateTime.now ().until (passwordResetToken.expiryDate, ChronoUnit.MILLIS);

        if (until <= 0)
        {
            // token expired
            return false;
        }

        return passwordResetToken.user.id.equals (userId);

    }
}
