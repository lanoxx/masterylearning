package org.masterylearning.service;

import org.masterylearning.domain.User;
import org.masterylearning.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Inject UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername (String username) throws UsernameNotFoundException {

        User user;

        if (username.contains ("@")) {
            user = userRepository.getUserByEmail (username);
        } else {
            user = userRepository.getUserByUsername (username);
        }



        if (user != null) {
            return user;
        }

        throw new UsernameNotFoundException ("User does not exist");
    }
}
