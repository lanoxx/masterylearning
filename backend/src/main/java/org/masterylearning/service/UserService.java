package org.masterylearning.service;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.masterylearning.domain.PasswordResetToken;
import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.repository.PasswordResetTokenRepository;
import org.masterylearning.repository.RoleRepository;
import org.masterylearning.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalLong;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final Logger log = LogManager.getLogger (UserService.class);

    @Inject PasswordEncoder passwordEncoder;
    @Inject UserRepository userRepository;
    @Inject RoleRepository roleRepository;
    @Inject PasswordResetTokenRepository passwordResetTokenRepository;
    @Inject MailSender mailSender;

    @Value ("${email.from:user@localhost}")
    private String fromAddress;

    @Transactional
    public User createUser (String fullname, String email, String username, String password) {

        String encodedPassword = passwordEncoder.encode (password);

        User user = new User (fullname, email, username, encodedPassword);

        userRepository.save (user);

        return user;
    }

    @Transactional
    public User createUser (CreateUserDto dto) {

        List<Role> roles = dto.roles.stream ()
                                    .map (role -> roleRepository.findRoleByName (role))
                                    .collect (Collectors.toList ());

        User user = createUser (dto.fullname, dto.email, dto.username, dto.password);

        user.getRoles ().addAll (roles);

        userRepository.save (user);

        sendAccountCreationMail (dto, fromAddress, user);

        return user;
    }

    @Transactional
    public boolean deleteUser (String username) {
        User userByUsername = userRepository.getUserByUsername (username);

        if (userByUsername == null) {
            return false;
        }

        List<PasswordResetToken> passwordResetTokenByUser_username =
                passwordResetTokenRepository.findPasswordResetTokenByUser_Username (username);

        passwordResetTokenRepository.deleteInBatch (passwordResetTokenByUser_username);

        userRepository.delete (userByUsername);

        return true;
    }


    @Transactional
    public PasswordResetToken createPasswordResetToken (User user) {
        PasswordResetToken resetToken = new PasswordResetToken ();

        String token = UUID.randomUUID ().toString ();

        resetToken.user = user;
        resetToken.token = token;
        resetToken.expiryDate = LocalDateTime.now ()
                                             .plus (PasswordResetToken.VALID_DURATION);

        passwordResetTokenRepository.save (resetToken);

        return resetToken;
    }

    public String generateDefaultUsername () {

        // if no user name was given we try to assign a random username
        User existingUser = null;
        for (int i = 0; i < 10; i++) {
            String username;
            OptionalLong randomCandidate = new Random ().ints (10000, 9999999)
                                                        .asLongStream ()
                                                        .findAny ();

            if (!randomCandidate.isPresent ()) {
                continue;
            }
            Long number = randomCandidate.getAsLong ();
            username = "user" + String.format ("%07d", number);

            existingUser = userRepository.getUserByUsername (username);

            // the username does not exist yet, so break;
            if (existingUser == null) {
                return username;
            }
        }

        // we have tried 10 time, but all randomly generated usernames already existed
        if (existingUser != null) {
            return null;
        }

        return null;
    }

    public String generateDefaultPassword () {
        return RandomStringUtils.random (10, true, true);
    }

    private void sendAccountCreationMail (CreateUserDto createUserDto, String from, User user) {
        try {
            SimpleMailMessage email = getAccountCreatedMail (createUserDto, user, from);

            mailSender.send (email);

            log.debug ("Account creation mail successfully sent to: " + user.email);

        } catch (MailException e) {

            throw new MailSendException ("An error occurred while sending the mail to: " + user.email, e);
        }
    }

    private SimpleMailMessage getAccountCreatedMail (CreateUserDto createUserDto, User user, String from) {
        SimpleMailMessage email = new SimpleMailMessage ();
        email.setFrom (from);
        email.setTo (user.email);
        email.setSubject ("Interactive Lecture Notes Account");
        email.setText ("Dear " + user.fullname + ",\n" +
                               "\n" +
                               "We have created an account for our e-learning software for you.\n" +
                               "Below are the details to login to the system:\n" +
                               "Email: " + user.email + "\n" +
                               "Password: " + createUserDto.password + "\n" +
                               "\n" +
                               "Please use the following link to login:\n" +
                               "https://elearning.forsyte.at\n" +
                               "\n" +
                               "Thank you for your interest in our e-learning system.\n" +
                               "\n" +
                               "Sebastian Geiger,\n" +
                               "Andreas Holzer,\n" +
                               "Forsyte");
        return email;
    }
}
