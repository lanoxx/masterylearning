package org.masterylearning.service;

import org.masterylearning.domain.PasswordResetToken;
import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.domain.ValidationIssue;
import org.masterylearning.domain.ValidationResult;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.repository.PasswordResetTokenRepository;
import org.masterylearning.repository.RoleRepository;
import org.masterylearning.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalLong;
import java.util.Random;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {

    public static final String USERNAME_REGEX = "[a-z0-9](-?[a-z0-9])*";

    @Inject PasswordEncoder passwordEncoder;
    @Inject UserRepository userRepository;
    @Inject RoleRepository roleRepository;
    @Inject PasswordResetTokenRepository passwordResetTokenRepository;

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
}
