package org.masterylearning.event;

import org.masterylearning.domain.User;
import org.masterylearning.service.LoginHistoryService;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

/**
 *
 */
@Component
public class AuthenticationEventListener implements ApplicationListener<AuthenticationSuccessEvent> {


    @Inject LoginHistoryService loginHistoryService;

    @Override
    public void onApplicationEvent (AuthenticationSuccessEvent event) {

        Object principal = event.getAuthentication ().getPrincipal ();

        if (!(principal instanceof User)) {
            return;
        }

        User user = (User) principal;

        loginHistoryService.createLoginHistory (user);
    }
}
