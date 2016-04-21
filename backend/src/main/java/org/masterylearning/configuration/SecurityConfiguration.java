package org.masterylearning.configuration;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;

/**
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    Logger logger = LogManager.getLogger (SecurityConfiguration.class);

    @Override
    protected void configure (HttpSecurity http) throws Exception {
        http.csrf().disable();

        logger.info ("SecurityConfiguration: Allowing all HTTP OPTIONS Requests in order to support CORS.");

        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        AuthenticationEntryPoint entryPoint = entryPoint();
        http.exceptionHandling().authenticationEntryPoint(entryPoint);
        http.httpBasic().authenticationEntryPoint(entryPoint);
        http.requestMatchers().antMatchers("/**");
        //String[] roles = new String[] { "USER", "ADMIN"};

        //http.authorizeRequests().anyRequest().hasAnyRole(roles);

        http.authorizeRequests()
                .antMatchers (HttpMethod.OPTIONS, "/**").permitAll ()
                .antMatchers (HttpMethod.GET, "/bootstrap/**").permitAll ()
                .antMatchers (HttpMethod.POST, "/password/resetToken/**").permitAll ()
                .anyRequest().authenticated();
    }

    private AuthenticationEntryPoint entryPoint() {
        BasicAuthenticationEntryPoint entryPoint = new BasicAuthenticationEntryPoint();
        entryPoint.setRealmName("MasteryLearning");
        return entryPoint;
    }
}
