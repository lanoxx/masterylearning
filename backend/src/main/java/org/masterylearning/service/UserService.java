package org.masterylearning.service;

import org.masterylearning.domain.PasswordResetToken;
import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.dto.out.CreateUserOutDto;
import org.masterylearning.repository.PasswordResetTokenRepository;
import org.masterylearning.repository.RoleRepository;
import org.masterylearning.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalLong;
import java.util.Random;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Inject PasswordEncoder passwordEncoder;
    @Inject UserRepository userRepository;
    @Inject RoleRepository roleRepository;
    @Inject PasswordResetTokenRepository passwordResetTokenRepository;

    public User createUser (String fullname, String email, String username, String password) {

        String encodedPassword = passwordEncoder.encode (password);

        User user = new User (fullname, email, username, encodedPassword);

        userRepository.save (user);

        return user;
    }

    @Transactional
    public User createUser (CreateUserDto dto) {

        List<Role> roles = dto.roles.stream ()
                             .map (role -> roleRepository.findRoleByName (role))
                             .collect (Collectors.toList ());

        User user = createUser (dto.fullname, dto.email, dto.username, dto.password);

        user.getRoles ().addAll (roles);

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
