package org.masterylearning.web;

import org.masterylearning.domain.User;
import org.masterylearning.repository.UserRepository;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;

@RestController
public class AuthenticationController {

    @Inject UserRepository userRepository;

    @RequestMapping (value = "login")
    @Secured("IS_AUTHENTICATED_ANONYMOUSLY")
    boolean login (String username, String password)
    {
        User user = userRepository.getUserByUsername ("user");

        if (user.username.equals(username)) {
            if (user.password.equals(password)) {
                return true;
            }
        }

        return false;
    }

    @RequestMapping ("logout")
    boolean logout ()
    {
        // TODO get current principal from security context

        // Remove current principal

        return true;
    }
}
