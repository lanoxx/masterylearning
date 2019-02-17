package org.masterylearning.web;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.masterylearning.dto.in.ResetPasswordDto;
import org.masterylearning.dto.out.ChangePasswordOutDto;
import org.masterylearning.dto.out.PasswordResetOutDto;
import org.masterylearning.service.PasswordService;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

/**
 *
 */
@RestController
@RequestMapping (path = "password")
public class PasswordController {

    private Logger logger = LogManager.getLogger (PasswordController.class);

    @Inject Environment environment;
    @Inject PasswordService passwordService;

    @PostMapping(path = "/resetToken")
    public PasswordResetOutDto
    getPasswordTokenPerMail (HttpServletRequest request, @RequestBody ResetPasswordDto dto)
    {
        final String message = "Your password reset request has been received. If the provided username exists, then " +
                "an email with instructions on how to reset your password will be sent to the registered email address.";

        PasswordResetOutDto outDto = new PasswordResetOutDto ();

        String hostname = environment.getProperty ("email.hostname", request.getServerName());

        // when there was a problem with sending we inform the user accordingly, but if the provided username does not
        // exist then we return the same generic response to avoid that users abuse the mechanism
        // to check which usernames or email addresses are valid.
        try
        {
            passwordService.sendPasswordResetEmail (dto.username, hostname);
        }
        catch (UsernameNotFoundException e)
        {
            logger.debug (String.format ("The requested user account '%s' does not exist.", dto.username));
        }
        catch (MailException mailException)
        {
            outDto.message = "A password reset token could not be generated, because sending an email to the user failed.";
            outDto.success = false;
            return outDto;
        }

        outDto.message = message;
        outDto.success = true;

        return outDto;
    }

    /**
     * This methods resets the password of the user to which the token belongs to a new password
     * provided that the presented token exists and has not expired.
     */
    @PostMapping(path = "/resetToken/{token}")
    public ChangePasswordOutDto
    resetPassword (@PathVariable String token, @RequestBody ResetPasswordDto dto)
    {
        ChangePasswordOutDto outDto = new ChangePasswordOutDto ();

        if (dto.password == null) {
            outDto.message = "No password specified. Cannot reset password.";
            outDto.passwordChanged = false;
            return outDto;
        }

        boolean passwordChanged = passwordService.resetPassword (dto.userId, token, dto.password);

        if (!passwordChanged)
        {
            outDto.message = "The presented token was not valid or has expired and the password was not reset. " +
                    "Please request a new token.";
            outDto.passwordChanged = false;
            return outDto;
        }

        outDto.message = "Your password was reset, you can now login with the new password.";
        outDto.passwordChanged = true;

        return outDto;
    }
}
