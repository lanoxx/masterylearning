package org.masterylearning.service;

import org.masterylearning.domain.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 *
 */
@Component
public class UserFacade {

    public User getCurrentUser () {
        Authentication authentication = SecurityContextHolder.getContext ().getAuthentication ();

        if (authentication == null)
        {
            throw new UsernameNotFoundException ("No authentication context to retrieve principal.");
        }

        Object principal = authentication.getPrincipal ();

        if (!(principal instanceof User)) {
            throw new UsernameNotFoundException ("Security Principal not an instance of domain.User");
        }

        return (User) principal;
    }
}
