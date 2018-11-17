package org.masterylearning.configuration;

import org.masterylearning.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 *
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@Configuration
public class DaoSecurityConfiguration {

    @Bean
    public PasswordEncoder getPasswordEncoder () {
        return new BCryptPasswordEncoder ();
    }

    @Primary
    @Bean
    public UserDetailsService getUserDetailsService () {
        return new CustomUserDetailsService ();
    }
}
