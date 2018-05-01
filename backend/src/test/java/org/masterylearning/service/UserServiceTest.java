package org.masterylearning.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.domain.ValidationIssue;
import org.masterylearning.domain.ValidationResult;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.repository.RoleRepository;
import org.masterylearning.repository.UserRepository;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.*;

/**
 */
@RunWith(SpringRunner.class)
public class UserServiceTest {

    public static final User NULL_USER = new User (null, null, null, null);
    @InjectMocks private UserService userService = new UserService ();
    @Mock private UserRepository userRepository;
    @Spy private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder ();
    @Mock private RoleRepository roleRepository;

    @Before
    public void before () {
        MockitoAnnotations.initMocks (this);
    }

    @Test
    public void testEncodePasswortDuringUserCreation () {

        String password = "123456";
        User johndoe = userService.createUser ("John Doe", "john@doe.com", "johndoe", password);

        assertTrue (passwordEncoder.matches (password, johndoe.password));

        assertFalse (johndoe.password.equals (password));

    }

    @Test
    public void testUserCreationWithRoles () {

        when (roleRepository.findRoleByName ("STUDENT")).thenReturn (new Role ("STUDENT", null));
        when (roleRepository.findRoleByName ("TEACHER")).thenReturn (new Role ("TEACHER", null));
        when (roleRepository.findRoleByName ("ADMIN")).thenReturn (new Role ("ADMIN", null));

        CreateUserDto dto = new CreateUserDto ();
        dto.password = "123456";

        dto.roles = Arrays.asList ("STUDENT", "TEACHER", "ADMIN");

        User user = userService.createUser (dto);

        assertTrue (user.getRoles ().size () == 3);

        assertTrue (passwordEncoder.matches (dto.password, user.password));

        assertFalse (dto.password.equals (user.password));

    }

    /**
     * Test that username generation fails if all candidates exist and ensure that the
     * method tried at least 10 times.
     */
    @Test
    public void testDefaultUsernameGenerationFailing () {

        User user = NULL_USER;

        when (userRepository.getUserByUsername (Mockito.anyString ())).thenReturn (user);

        String username = userService.generateDefaultUsername ();

        assertTrue (username == null);

        verify (userRepository, atLeast (10)).getUserByUsername (Mockito.anyString ());

    }

    /**
     * Test that a default username is generated, is prefixed with 'user' and followed by 7 digits.
     */
    @Test
    public void testDefaultUsernameGenerationSuccussful () {

        when (userRepository.getUserByUsername (Mockito.anyString ())).thenReturn (null);

        String username = userService.generateDefaultUsername ();

        assertTrue (username != null);

        assertTrue (username.length () == 11);

        assertTrue (username.matches ("user[0-9]{7}"));

        verify (userRepository, times (1)).getUserByUsername (Mockito.anyString ());

    }


    @Test
    public void testValidationFailsOnMissingFullname () {

        CreateUserDto dto = getCreateUserDto ();

        dto.fullname = null;

        ValidationResult result = userService.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issue == ValidationIssue.FULLNAME_MISSING);

    }

    @Test
    public void testValidationFailsOnWrongEmail () {

        CreateUserDto dto = getCreateUserDto ();

        dto.email = null;

        ValidationResult result = userService.validateCreateUserDto (dto);

        assertTrue (result.issue == ValidationIssue.EMAIL_INVALID);

        dto = getCreateUserDto ();

        dto.email = "johndoe";

        result = userService.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issue == ValidationIssue.EMAIL_INVALID);
    }

    @Test
    public void testValidationFailsOnExistingEmail () {

        when (userRepository.getUserByEmail ("john@doe.com")).thenReturn (NULL_USER);

        CreateUserDto dto = getCreateUserDto ();

        ValidationResult result = userService.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issue == ValidationIssue.EMAIL_EXISTS);
    }

    @Test
    public void testValidationSucceedesOnMissingUsername () {

        CreateUserDto dto = getCreateUserDto ();

        dto.username = null;

        ValidationResult result = userService.validateCreateUserDto (dto);

        assertTrue (result.valid);
        assertTrue (result.issue == ValidationIssue.USERNAME_MISSING);
    }

    @Test
    public void testValidationFailsOnExistingUsername () {

        CreateUserDto dto = getCreateUserDto ();

        when (userRepository.getUserByUsername (dto.username)).thenReturn (NULL_USER);

        ValidationResult result = userService.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issue == ValidationIssue.USERNAME_EXISTS);
    }

    @Test
    public void testValidationFailsOnInvalidUsername () {

        CreateUserDto dto = getCreateUserDto ();

        //no double hypens allowed
        dto.username = "foo--bar";

        ValidationResult result = userService.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issue == ValidationIssue.USERNAME_INVALID);

        //no initial hypen
        dto.username = "-bar";

        result = userService.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issue == ValidationIssue.USERNAME_INVALID);

        //no underscores
        dto.username = "_bar";

        result = userService.validateCreateUserDto (dto);

        assertTrue (!result.valid);
        assertTrue (result.issue == ValidationIssue.USERNAME_INVALID);
    }

    @Test
    public void testValidationSuccessful () {

        CreateUserDto dto = getCreateUserDto ();

        ValidationResult result = userService.validateCreateUserDto (dto);

        assertTrue (result.valid);
        assertTrue (result.issue == null);
    }

    /**
     * @return An initially valid dto object. During testing we will selectively
     * reset fields to check if the validation fails.
     */
    public static CreateUserDto getCreateUserDto () {
        CreateUserDto dto = new CreateUserDto ();

        dto.fullname = "John Doe";
        dto.email = "john@doe.com";

        // a correct username can be upper and lower case, contain a hypen and digits
        dto.username = "J0hN-Doe-33";
        dto.password = "123456";
        dto.roles = Arrays.asList ("STUDENT", "TEACHER");

        return dto;
    }
}
