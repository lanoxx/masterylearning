package org.masterylearning.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.repository.RoleRepository;
import org.masterylearning.repository.UserRepository;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
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

    private static final User NULL_USER = new User (null, null, null, null);
    @InjectMocks private UserService userService = new UserService ();
    @Mock private UserRepository userRepository;
    @Spy private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder ();
    @Mock private RoleRepository roleRepository;
    @Mock private MailSender mailSender;

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

        verify (mailSender, atLeastOnce ()).send (Mockito.any (SimpleMailMessage.class));
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
    public void testDefaultUsernameGenerationSuccessful () {

        when (userRepository.getUserByUsername (Mockito.anyString ())).thenReturn (null);

        String username = userService.generateDefaultUsername ();

        assertTrue (username != null);

        assertTrue (username.length () == 11);

        assertTrue (username.matches ("user[0-9]{7}"));

        verify (userRepository, times (1)).getUserByUsername (Mockito.anyString ());

    }
}
