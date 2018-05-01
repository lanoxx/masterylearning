package org.masterylearning.web.validation;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.UserUtility;
import org.masterylearning.domain.User;
import org.masterylearning.domain.ValidationIssue;
import org.masterylearning.domain.ValidationResult;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.repository.UserRepository;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

/**
 */
@RunWith(SpringRunner.class)
public class UserValidationTest {

    private static final User NULL_USER = new User (null, null, null, null);

    @InjectMocks UserValidation userValidation;
    @Mock UserRepository userRepository;

    @Test
    public void testValidationFailsOnMissingFullname () {

        CreateUserDto dto = UserUtility.getCreateUserDto ();

        dto.fullname = null;

        ValidationResult result = userValidation.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issues.contains (ValidationIssue.FULLNAME_MISSING));

    }

    @Test
    public void testValidationFailsOnWrongEmail () {

        CreateUserDto dto = UserUtility.getCreateUserDto ();

        dto.email = null;

        ValidationResult result = userValidation.validateCreateUserDto (dto);

        assertTrue (result.issues.contains (ValidationIssue.EMAIL_INVALID));

        dto = UserUtility.getCreateUserDto ();

        dto.email = "johndoe";

        result = userValidation.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issues.contains (ValidationIssue.EMAIL_INVALID));
    }

    @Test
    public void testValidationFailsOnExistingEmail () {

        when (userRepository.getUserByEmail ("john@doe.com")).thenReturn (NULL_USER);

        CreateUserDto dto = UserUtility.getCreateUserDto ();

        ValidationResult result = userValidation.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issues.contains (ValidationIssue.EMAIL_EXISTS));
    }

    @Test
    public void testValidationSucceedesOnMissingUsername () {

        CreateUserDto dto = UserUtility.getCreateUserDto ();

        dto.username = null;

        ValidationResult result = userValidation.validateCreateUserDto (dto);

        assertTrue (result.valid);
        assertTrue (result.issues.contains (ValidationIssue.USERNAME_MISSING));
    }

    @Test
    public void testValidationFailsOnExistingUsername () {

        CreateUserDto dto = UserUtility.getCreateUserDto ();

        when (userRepository.getUserByUsername (dto.username)).thenReturn (NULL_USER);

        ValidationResult result = userValidation.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issues.contains (ValidationIssue.USERNAME_EXISTS));
    }

    @Test
    public void testValidationFailsOnInvalidUsername () {

        CreateUserDto dto = UserUtility.getCreateUserDto ();

        //no double hypens allowed
        dto.username = "foo--bar";

        ValidationResult result = userValidation.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issues.contains (ValidationIssue.USERNAME_INVALID));

        //no initial hypen
        dto.username = "-bar";

        result = userValidation.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issues.contains (ValidationIssue.USERNAME_INVALID));

        //no underscores
        dto.username = "_bar";

        result = userValidation.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issues.contains (ValidationIssue.USERNAME_INVALID));
    }

    @Test
    public void testValidationSuccessful () {

        CreateUserDto dto = UserUtility.getCreateUserDto ();

        ValidationResult result = userValidation.validateCreateUserDto (dto);

        assertTrue (result.valid);
        assertTrue (result.issues.isEmpty ());
    }
}
