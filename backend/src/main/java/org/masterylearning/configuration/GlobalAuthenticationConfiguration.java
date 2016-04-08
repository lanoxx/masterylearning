package org.masterylearning.configuration;

import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

import javax.inject.Inject;

/**
 */
@Order (Ordered.HIGHEST_PRECEDENCE)
@Configuration
public class GlobalAuthenticationConfiguration extends GlobalAuthenticationConfigurerAdapter {

    @Inject UserDetailsService userDetailsService;

    @Inject SecurityProperties securityProperties;

    @Override
    public void init (AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService (userDetailsService);
            //.inMemoryAuthentication ().withUser ("user").password ("123456");
    }
}
