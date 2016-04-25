package org.masterylearning.configuration;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.util.Assert;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 */
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint, InitializingBean {

    private String realmName;

    @Override
    public void commence (HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.addHeader("WWW-Authenticate", "Restful realm=\""+ realmName + "\"");
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                           authException.getMessage());
    }

    public String getRealmName() {
        return realmName;
    }

    public void setRealmName(String realmName) {
        this.realmName = realmName;
    }

    @Override
    public void afterPropertiesSet () throws Exception {
        Assert.hasText(realmName, "realmName must be specified");
    }
}
