package org.masterylearning.web;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.domain.User;
import org.masterylearning.domain.ValidationIssue;
import org.masterylearning.domain.ValidationResult;
import org.masterylearning.dto.CreateUsersOutDto;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.dto.in.CreateUsersInDto;
import org.masterylearning.dto.out.CreateUserOutDto;
import org.masterylearning.service.UserService;
import org.masterylearning.web.validation.UserValidation;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;

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

    @Test
    public void testImportOfUsersWithErrors () {

        CreateUsersInDto usersDto = getImportUsers ();

        String generatedUsername = "user1234567";

        User user = new User (null, null, generatedUsername, null);

        user.id = 1L;

        ValidationResult result;

        result = new ValidationResult ();
        result.valid = true;
        result.issues.add (ValidationIssue.PASSWORD_MISSING);
        result.issues.add (ValidationIssue.USERNAME_MISSING);

        when (userValidation.validateCreateUserDto (usersDto.users.get (0))).thenReturn (result);

        result = new ValidationResult ();
        result.valid = false;
        result.issues.add (ValidationIssue.EMAIL_INVALID);

        when (userValidation.validateCreateUserDto (usersDto.users.get (1))).thenReturn (result);

        result = new ValidationResult ();
        result.valid = false;
        result.issues.add (ValidationIssue.FULLNAME_MISSING);

        when (userValidation.validateCreateUserDto (usersDto.users.get (2))).thenReturn (result);

        when (userService.createUser (Mockito.any ())).thenReturn (user);

        when (userService.generateDefaultUsername ()).thenReturn (generatedUsername);
        when (userService.generateDefaultPassword ()).thenCallRealMethod ();

        CreateUsersOutDto createUsersOutDto = userController.createUsers (usersDto);

        verify (userService, times (1)).generateDefaultUsername ();
        verify (userService, times (1)).generateDefaultPassword ();
        verify (userService, times (1)).createUser (Mockito.any ());

        Assert.assertTrue (createUsersOutDto.users.size () == 2);

        CreateUserOutDto createUserOutDto;

        createUserOutDto = createUsersOutDto.users.get (0);
        Assert.assertTrue (createUserOutDto.message.equals (ValidationIssue.EMAIL_INVALID.getMessage ()));

        createUserOutDto = createUsersOutDto.users.get (1);
        Assert.assertTrue (createUserOutDto.message.equals (ValidationIssue.FULLNAME_MISSING.getMessage ()));
    }

    private CreateUsersInDto getImportUsers () {
        CreateUsersInDto usersdto = new CreateUsersInDto ();
        usersdto.users = new ArrayList<> ();

        CreateUserDto dto;

        dto = new CreateUserDto ();
        dto.fullname = "Test User";
        dto.email = "test@example.com";
        usersdto.users.add (dto);

        dto = new CreateUserDto ();
        dto.fullname = "Test User";
        usersdto.users.add (dto);

        dto = new CreateUserDto ();
        dto.email = "test@example.com";
        usersdto.users.add (dto);

        return usersdto;
    }

}
