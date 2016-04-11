package org.masterylearning.service;

import org.masterylearning.domain.User;
import org.masterylearning.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

@Service
public class UserService {

    @Inject PasswordEncoder passwordEncoder;
    @Inject UserRepository userRepository;

    public User createUser (String fullname, String username, String password) {

        String encodedPassword = passwordEncoder.encode (password);

        User user = new User (fullname, username, encodedPassword);

        userRepository.save (user);

        return user;
    }
}
