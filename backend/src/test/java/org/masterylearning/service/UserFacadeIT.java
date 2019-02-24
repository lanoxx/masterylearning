package org.masterylearning.service;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.domain.User;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.junit4.SpringRunner;

import javax.inject.Inject;

/**
 *
 */
@RunWith (SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
public class UserFacadeIT {

    @TestConfiguration
    static class TestSecurityConfiguration {

        @Bean(name = "testUserDetailsService")
        @Primary
        public UserDetailsService getUserDetailsService () {
            return new TestUserDetailsService ();
        }

    }

    @Inject UserFacade userFacade;

    private final String TEST_USERNAME = "test";

    @Test
    @WithUserDetails(value = TEST_USERNAME, userDetailsServiceBeanName = "testUserDetailsService")
    public void gettingUser_shouldSucceed () {

        User currentUser = userFacade.getCurrentUser ();

        Assert.assertNotNull (currentUser);

        Assert.assertEquals (TEST_USERNAME, currentUser.getUsername ());
    }

    static class TestUserDetailsService implements UserDetailsService {

        @Override
        public UserDetails loadUserByUsername (String username) throws UsernameNotFoundException {
            return new User (username, "test@test.com", "test", "test");
        }
    }
}
