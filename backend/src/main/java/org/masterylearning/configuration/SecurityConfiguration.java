package org.masterylearning.configuration;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;

/**
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity (prePostEnabled = true, securedEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    /**
     * Ant-Matcher Patterns to allow requests for Swagger UI and Swagger APIs
     */
    public static final String[] SWAGGER_PATTERNS = {
            "/v2/api-docs", "/configuration/ui",
            "/swagger-resources", "/configuration/security",
            "/swagger-ui.html", "/webjars/**"};

    Logger logger = LogManager.getLogger (SecurityConfiguration.class);

    @Override
    protected void configure (HttpSecurity http) throws Exception {
        http.csrf().disable();

        logger.info ("SecurityConfiguration: Allowing all HTTP OPTIONS Requests in order to support CORS.");

        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        AuthenticationEntryPoint entryPoint = entryPoint();
        AccessDeniedHandler accessDeniedHandler = accessDeniedHandler ();

        http.exceptionHandling()
            .authenticationEntryPoint(entryPoint)
            .accessDeniedHandler (accessDeniedHandler);

        http.httpBasic().authenticationEntryPoint(entryPoint);
        http.requestMatchers().antMatchers("/**");
        //String[] roles = new String[] { "USER", "ADMIN"};

        //http.authorizeRequests().anyRequest().hasAnyRole(roles);

        http.authorizeRequests ()
            .antMatchers (HttpMethod.OPTIONS, "/**").permitAll ()
            .antMatchers (HttpMethod.POST, "/bootstrap/**").permitAll ()
            .antMatchers (HttpMethod.POST, "/password/resetToken/**").permitAll ()
            .antMatchers (SWAGGER_PATTERNS).permitAll ()
            .anyRequest().authenticated();
    }

    private AuthenticationEntryPoint entryPoint() {
        RestAuthenticationEntryPoint entryPoint = new RestAuthenticationEntryPoint ();
        entryPoint.setRealmName("MasteryLearning");
        return entryPoint;
    }

    private AccessDeniedHandler accessDeniedHandler() {
        return new AccessDeniedHandlerImpl ();
    }
}
