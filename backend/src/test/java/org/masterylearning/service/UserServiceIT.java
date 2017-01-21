package org.masterylearning.service;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.App;
import org.masterylearning.domain.User;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.repository.RoleRepository;
import org.masterylearning.repository.UserRepository;
import org.mockito.Mockito;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.MailSendException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

/**
 */
@RunWith(SpringJUnit4ClassRunner.class)
@IntegrationTest
@SpringApplicationConfiguration({App.class, UserServiceIT.MockConfiguration.class})
@TestPropertySource(locations="classpath:app.properties")
public class UserServiceIT {

    @Inject UserRepository userRepository;
    @Inject RoleRepository roleRepository;

    @Inject PasswordEncoder passwordEncoder;

    @Inject UserService userService;

    @SuppressWarnings("SpringJavaAutowiringInspection")
    @Inject MailSender mailSender;


    /* See this link for an explanation why we need this:
     * http://stackoverflow.com/questions/21124326/how-to-inject-mock-into-service-that-has-transactional
     *
     * We need to mock the MailSender, because we need to mock successful and failed mail sending during the tests
     * However, we cannot inject the mocked mail server, using @InjectMocks from Mockito because it breaks
     * transactions. Using this lets spring inject the mock just like a bean.
     */
    public static class MockConfiguration {

        @Bean
        @Primary
        public MailSender mockCountryService() {
            return Mockito.mock (MailSender.class);
        }

    }

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

        Assert.assertTrue (userByEmail != null);
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

            Assert.assertTrue (userByEmail == null);
        }
    }
}
