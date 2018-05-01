package org.masterylearning.service;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.masterylearning.domain.PasswordResetToken;
import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.domain.ValidationIssue;
import org.masterylearning.domain.ValidationResult;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.repository.PasswordResetTokenRepository;
import org.masterylearning.repository.RoleRepository;
import org.masterylearning.repository.UserRepository;
import org.masterylearning.web.CreateUsersDto;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.OptionalLong;
import java.util.Random;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {

    public static final String USERNAME_REGEX = "[a-z0-9](-?[a-z0-9])*";

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

    public PasswordResetToken createPasswordResetToken (User user, String token) {
        PasswordResetToken resetToken = new PasswordResetToken ();

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

    public Map<ValidationResult, CreateUserDto> validateCreateUsersDto (CreateUsersDto usersDto) {

        Map<ValidationResult, CreateUserDto> results = new HashMap<> ();

        for (CreateUserDto dto : usersDto.users) {
            ValidationResult result = new ValidationResult ();
            result.valid = false;

            if (dto.fullname == null) {
                result.issue = ValidationIssue.FULLNAME_MISSING;
                results.put (result, dto);
                continue;
            }

            if (dto.email == null || !dto.email.contains ("@")) {
                result.issue = ValidationIssue.EMAIL_INVALID;
                results.put (result, dto);
                continue;
            } else {
                User userByEmail = userRepository.getUserByEmail (dto.email);
                if (userByEmail != null) {
                    result.issue = ValidationIssue.EMAIL_EXISTS;
                    results.put (result, dto);
                    continue;
                }
            }

            result.valid = true;
            results.put (result, dto);
        }

        return results;
    }

    public ValidationResult validateCreateUserDto (CreateUserDto dto) {
        User existingUser;
        ValidationResult result = new ValidationResult ();
        result.valid = false;

        if (dto.fullname == null) {
            result.issue = ValidationIssue.FULLNAME_MISSING;
            return result;
        }

        if (dto.email == null || !dto.email.contains ("@")) {
            result.issue = ValidationIssue.EMAIL_INVALID;
            return result;
        } else {
            User userByEmail = userRepository.getUserByEmail (dto.email);
            if (userByEmail != null) {
                result.issue = ValidationIssue.EMAIL_EXISTS;
                return result;
            }
        }


        if (dto.username != null) {
            existingUser = userRepository.getUserByUsername (dto.username);
            if (existingUser != null) {
                result.issue = ValidationIssue.USERNAME_EXISTS;
                return result;
            }

            Pattern pattern = Pattern.compile (USERNAME_REGEX, Pattern.CASE_INSENSITIVE);
            if (!pattern.matcher (dto.username).matches ()) {
                result.issue = ValidationIssue.USERNAME_INVALID;
                return result;
            }
        } else {
            // missing usernames do not make the dto invalid, since we are going to create a generic username
            result.valid = true;
            result.issue = ValidationIssue.USERNAME_MISSING;
            return result;
        }

        result.valid = true;
        return result;
    }

    @Transactional
    public User importUser (CreateUserDto createUserDto, String from) {

        createUserDto.password = this.generateDefaultPassword ();

        createUserDto.username = this.generateDefaultUsername ();

        if (createUserDto.roles.size () == 0) {
            createUserDto.roles.add ("STUDENT");
        }

        User user = this.createUser (createUserDto);

        return user;
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
