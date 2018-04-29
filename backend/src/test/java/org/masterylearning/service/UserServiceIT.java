package org.masterylearning.service;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.domain.User;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.repository.UserRepository;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.MailSendException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

/**
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(locations="classpath:app.properties",
                    /* we need to disable mail health check since we are mocking the mailSender bean */
                    properties = {"management.health.mail.enabled=false"})
public class UserServiceIT {

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;

    @MockBean
    private MailSender mailSender;

    /**
     * Test that a user is successfully created and that the call to the
     * MailSender was made.
     */
    @Test
    @Transactional
    public void testUserImportIsSuccessful () {

        CreateUserDto createUserDto = new CreateUserDto ();
        createUserDto.fullname = "John Doe";
        createUserDto.email = "john@example.com";

        userService.importUser (createUserDto, "sender@example.com");

        Mockito.verify (mailSender, Mockito.times (1)).send (Mockito.any (SimpleMailMessage.class));

        User userByEmail = userRepository.getUserByEmail ("john@example.com");

        Assert.assertNotNull (userByEmail);
    }


    /**
     * Test that when we throw a MailSendException the transaction is rolled back and there is
     * no user saved to the database.
     */
    @Test
    public void testUserImportIsRolledBack () {

        CreateUserDto createUserDto = new CreateUserDto ();
        createUserDto.fullname = "John Doe";
        createUserDto.email = "john@example.com";

        Mockito.doThrow (new MailSendException ("Failure")).when (mailSender).send (Mockito.any (SimpleMailMessage.class));

        try {
            userService.importUser (createUserDto, "sender@example.com");

            Assert.fail ("Expected MailSendException during user import.");

        } catch (MailSendException e) {

            User userByEmail = userRepository.getUserByEmail ("john@example.com");

            Assert.assertNull ("Expected imported user to be rolled back", userByEmail);
        }
    }
}
