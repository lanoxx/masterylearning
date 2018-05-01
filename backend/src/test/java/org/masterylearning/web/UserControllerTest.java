package org.masterylearning.web;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.domain.User;
import org.masterylearning.domain.ValidationIssue;
import org.masterylearning.domain.ValidationResult;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.dto.out.CreateUserOutDto;
import org.masterylearning.service.UserService;
import org.masterylearning.web.validation.UserValidation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.junit4.SpringRunner;

import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService = new UserService ();

    @Mock
    private UserValidation userValidation = new UserValidation ();

    @Before
    public void before () {
        MockitoAnnotations.initMocks (this);
    }

    /**
     * Test that a default username is generated if none is given.
     */
    @Test
    public void testDefaultUsernameGeneration () {

        CreateUserDto dto = new CreateUserDto ();

        String generatedUsername = "user1234567";

        User user = new User (null, null, generatedUsername, null);

        user.id = 1L;

        ValidationResult result = new ValidationResult ();
        result.valid = true;
        result.issues.add (ValidationIssue.USERNAME_MISSING);

        when (userValidation.validateCreateUserDto (dto)).thenReturn (result);

        when (userService.generateDefaultUsername ()).thenReturn (generatedUsername);

        when (userService.createUser (dto)).thenReturn (user);

        CreateUserOutDto outDto = userController.createUser (dto);

        verify (userService, times (1)).generateDefaultUsername ();
        verify (userService, times (1)).createUser (dto);

        Assert.assertTrue (dto.username != null);

        Assert.assertTrue (outDto.userId != null);
    }

    @Test
    public void testDefaultPasswordGeneration () {

        CreateUserDto dto = new CreateUserDto ();

        String generatedUsername = "user1234567";

        User user = new User (null, null, generatedUsername, null);

        user.id = 1L;

        ValidationResult result = new ValidationResult ();
        result.valid = true;
        result.issues.add (ValidationIssue.PASSWORD_MISSING);

        when (userValidation.validateCreateUserDto (dto)).thenReturn (result);

        when (userService.generateDefaultUsername ()).thenReturn (generatedUsername);
        when (userService.generateDefaultPassword ()).thenCallRealMethod ();

        when (userService.createUser (dto)).thenReturn (user);

        CreateUserOutDto outDto = userController.createUser (dto);

        verify (userService, times (1)).generateDefaultPassword ();
        verify (userService, times (1)).createUser (dto);

        Assert.assertTrue (dto.password != null);

        Assert.assertTrue (outDto.userId != null);
    }

    @Test
    public void testGenerationOfUsernameAndPassword () {

        CreateUserDto dto = new CreateUserDto ();

        String generatedUsername = "user1234567";

        User user = new User (null, null, generatedUsername, null);

        user.id = 1L;

        ValidationResult result = new ValidationResult ();
        result.valid = true;
        result.issues.add (ValidationIssue.PASSWORD_MISSING);
        result.issues.add (ValidationIssue.USERNAME_MISSING);

        when (userValidation.validateCreateUserDto (dto)).thenReturn (result);

        when (userService.generateDefaultUsername ()).thenReturn (generatedUsername);
        when (userService.generateDefaultPassword ()).thenCallRealMethod ();

        when (userService.createUser (dto)).thenReturn (user);

        CreateUserOutDto outDto = userController.createUser (dto);

        verify (userService, times (1)).generateDefaultUsername ();
        verify (userService, times (1)).generateDefaultPassword ();
        verify (userService, times (1)).createUser (dto);

        Assert.assertTrue (dto.password != null);
        Assert.assertTrue (dto.username != null);

        Assert.assertTrue (outDto.userId != null);
    }

}
