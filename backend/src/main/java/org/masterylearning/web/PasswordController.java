package org.masterylearning.web;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.masterylearning.domain.PasswordResetToken;
import org.masterylearning.domain.User;
import org.masterylearning.dto.in.ResetPasswordDto;
import org.masterylearning.dto.out.ChangePasswordOutDto;
import org.masterylearning.dto.out.PasswordResetOutDto;
import org.masterylearning.repository.PasswordResetTokenRepository;
import org.masterylearning.repository.UserRepository;
import org.masterylearning.service.UserService;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 *
 */
@RestController
@RequestMapping (path = "password")
public class PasswordController {

    Logger logger = LogManager.getLogger (PasswordController.class);

    @Inject Environment environment;

    @Inject UserRepository userRepository;
    @Inject UserService userService;
    @Inject PasswordResetTokenRepository passwordResetTokenRepository;
    @Inject PasswordEncoder passwordEncoder;

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Inject MailSender mailSender;

    @CrossOrigin
    @RequestMapping (method = RequestMethod.POST, path = "/resetToken")
    @Transactional
    public PasswordResetOutDto
    getPasswordTokenPerMail (HttpServletRequest request, @RequestBody ResetPasswordDto dto)
    {
        PasswordResetOutDto outDto = new PasswordResetOutDto ();
        String token = UUID.randomUUID ().toString ();

        User user;

        if (dto.username.contains ("@")) {
            user = userRepository.getUserByEmail (dto.username);
        } else {
            user = userRepository.getUserByUsername (dto.username);
        }

        if (user == null) {
            outDto.message = "The user you are requesting does not exist.";
            outDto.success = false;
            return outDto;
        }

        PasswordResetToken resetToken
                = userService.createPasswordResetToken (user, token);

        passwordResetTokenRepository.save (resetToken);

        String hostname = environment.getProperty ("email.hostname");
        String from = environment.getProperty ("email.from");
        hostname = hostname != null ? hostname : request.getServerName();

        // We always use a secure url here, since we have no way of detecting if the frontend server
        // is using a secure connection. Its the task of the frontend server to rewrite this if it is using
        // unsecure connections.
        String url = "https://" + hostname + "/user/password/resetToken/" + token + "/user/" + user.id;

        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom (from);
        email.setTo(user.email);
        email.setSubject("Reset e-learning Password");
        email.setText("Click here to rest your password for the system: " + url);

        try {
            mailSender.send (email);
            outDto.message = "An email was sent to the respective user account with instructions on how to reset your password";
            outDto.success = true;
        } catch (MailException ex) {
            logger.error ("An error occurred while sending the mail. The mail could not be send.", ex);
        }

        logger.debug ("A user reset token has been generated for user '" + dto.username + "': " + token);
        logger.debug ("Please visit: " + url + " to reset.");

        return outDto;
    }

    private boolean
    validateResetPasswordToken (Long userId, PasswordResetToken passwordResetToken)
    {
        if (passwordResetToken == null || passwordResetToken.expiryDate == null) {
            return false;
        }

        long until = LocalDateTime.now ().until (passwordResetToken.expiryDate, ChronoUnit.MILLIS);

        if (until > 0) {
            if (passwordResetToken.user.id.equals (userId)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Here we actually reset the password
     */
    @CrossOrigin
    @RequestMapping (method = RequestMethod.POST, path = "/resetToken/{token}")
    @Transactional
    public ChangePasswordOutDto
    resetPassword (@PathVariable String token, @RequestBody ResetPasswordDto dto)
    {
        ChangePasswordOutDto outDto = new ChangePasswordOutDto ();
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findPasswordResetTokenByToken (token);

        if (validateResetPasswordToken (dto.userId, passwordResetToken)) {
            if (dto.password == null) {
                outDto.message = "No password specified. Cannot reset password.";
                outDto.passwordChanged = false;
                return outDto;
            }

            User user = passwordResetToken.user;
            user.password = passwordEncoder.encode (dto.password);
            userRepository.save (user);

            passwordResetTokenRepository.delete (passwordResetToken);

            outDto.message = "Your password was reset, you can now login with the new password.";
            outDto.passwordChanged = true;
        } else {
            outDto.message = "The given token has expired and the password was not reset. Please request a new token.";
            outDto.passwordChanged = false;
        }

        return outDto;
    }
}
