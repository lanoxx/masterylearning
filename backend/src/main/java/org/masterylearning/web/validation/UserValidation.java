package org.masterylearning.web.validation;

import org.apache.commons.lang3.StringUtils;
import org.masterylearning.domain.User;
import org.masterylearning.domain.ValidationIssue;
import org.masterylearning.domain.ValidationResult;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.repository.UserRepository;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.util.regex.Pattern;

/**
 */
@Component
public class UserValidation {

    private static final String USERNAME_REGEX = "[a-z0-9](-?[a-z0-9])*";

    @Inject private UserRepository userRepository;

    public ValidationResult validateCreateUserDto (CreateUserDto dto) {
        User existingUser;
        ValidationResult result = new ValidationResult ();
        result.valid = false;

        if (dto.fullname == null) {
            result.issues.add (ValidationIssue.FULLNAME_MISSING);
            return result;
        }

        if (dto.email == null || !dto.email.contains ("@")) {
            result.issues.add (ValidationIssue.EMAIL_INVALID);
            return result;
        } else {
            User userByEmail = userRepository.getUserByEmail (dto.email);
            if (userByEmail != null) {
                result.issues.add (ValidationIssue.EMAIL_EXISTS);
                return result;
            }
        }

        if (StringUtils.isNotEmpty (dto.username)) {
            existingUser = userRepository.getUserByUsername (dto.username);
            if (existingUser != null) {
                result.issues.add (ValidationIssue.USERNAME_EXISTS);
                return result;
            }

            Pattern pattern = Pattern.compile (USERNAME_REGEX, Pattern.CASE_INSENSITIVE);
            if (!pattern.matcher (dto.username).matches ()) {
                result.issues.add (ValidationIssue.USERNAME_INVALID);
                return result;
            }
        } else {
            // missing usernames do not make the dto invalid, since we are going to create a generic username
            result.issues.add (ValidationIssue.USERNAME_MISSING);
        }

        if (StringUtils.isEmpty (dto.password)) {
            result.issues.add (ValidationIssue.PASSWORD_MISSING);
        }

        result.valid = true;
        return result;
    }
}
