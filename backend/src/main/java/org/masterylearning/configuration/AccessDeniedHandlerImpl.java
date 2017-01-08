package org.masterylearning.configuration;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.masterylearning.domain.User;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 */
public class AccessDeniedHandlerImpl extends org.springframework.security.web.access.AccessDeniedHandlerImpl {

    Logger logger = LogManager.getLogger (AccessDeniedHandlerImpl.class);

    @Override
    public void handle (HttpServletRequest request,
                        HttpServletResponse response,
                        AccessDeniedException accessDeniedException) throws IOException, ServletException
    {
        Authentication authentication = SecurityContextHolder.getContext ().getAuthentication ();
        Object principal = null;
        User user;
        String username = null;

        if (authentication != null) {
            principal = authentication.getPrincipal ();
        }

        if (principal != null) {
            if (principal instanceof User) {
                user = (User) principal;
                username = user.getUsername ();
            }
        }

        logger.debug ("Access to resource: " + request.getServletPath () + " is denied for user: " + username);

        super.handle (request, response, accessDeniedException);
    }
}
