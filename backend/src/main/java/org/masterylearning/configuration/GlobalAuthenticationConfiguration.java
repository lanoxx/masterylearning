package org.masterylearning.configuration;

import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.inject.Inject;

/**
 */
@Order (Ordered.HIGHEST_PRECEDENCE)
@Configuration
public class GlobalAuthenticationConfiguration extends GlobalAuthenticationConfigurerAdapter {

    @Inject UserDetailsService userDetailsService;

    @Inject SecurityProperties securityProperties;

    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void init (AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService (userDetailsService).passwordEncoder (getPasswordEncoder ());
    }

    @Bean
    public PasswordEncoder
    getPasswordEncoder () {
        if (passwordEncoder == null)
            passwordEncoder = new BCryptPasswordEncoder ();
        return passwordEncoder;
    }
}
