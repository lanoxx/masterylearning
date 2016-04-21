package org.masterylearning.service;

import org.masterylearning.domain.PasswordResetToken;
import org.masterylearning.domain.User;
import org.masterylearning.repository.PasswordResetTokenRepository;
import org.masterylearning.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.time.LocalDateTime;

@Service
public class UserService {

    @Inject PasswordEncoder passwordEncoder;
    @Inject UserRepository userRepository;
    @Inject PasswordResetTokenRepository passwordResetTokenRepository;

    public User createUser (String fullname, String username, String password) {

        String encodedPassword = passwordEncoder.encode (password);

        User user = new User (fullname, username, encodedPassword);

        userRepository.save (user);

        return user;
    }

    public PasswordResetToken createPasswordResetToken (User user, String token) {
        PasswordResetToken resetToken = new PasswordResetToken ();

        resetToken.user = user;
        resetToken.token = token;
        resetToken.expiryDate = LocalDateTime.now ()
                                             .plus (PasswordResetToken.VALID_DURATION);

        passwordResetTokenRepository.save (resetToken);

        return resetToken;
    }
}
