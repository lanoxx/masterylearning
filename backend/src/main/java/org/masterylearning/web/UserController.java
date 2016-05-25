package org.masterylearning.web;

import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.dto.in.ChangePasswordDto;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.dto.out.ChangePasswordOutDto;
import org.masterylearning.dto.out.CreateUserOutDto;
import org.masterylearning.dto.out.UserOutDto;
import org.masterylearning.repository.RoleRepository;
import org.masterylearning.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.OptionalLong;
import java.util.Random;
import java.util.stream.Collectors;

/**
 */
@RestController
@RequestMapping (path = "users")
public class UserController {

    @Inject UserRepository userRepository;
    @Inject RoleRepository roleRepository;
    @Inject PasswordEncoder passwordEncoder;

    @CrossOrigin
    @RequestMapping (method = RequestMethod.GET, path = "/current")
    @Transactional
    public UserOutDto
    getUser () {
        Object principal = SecurityContextHolder.getContext ().getAuthentication ().getPrincipal ();
        if (principal instanceof User) {
            return new UserOutDto ((User) principal);
        }

        return null;
    }

    @CrossOrigin
    @PreAuthorize (value = "hasRole('ADMIN')")
    @RequestMapping (method = RequestMethod.POST)
    public CreateUserOutDto
    createUser (@RequestBody CreateUserDto dto) {
        CreateUserOutDto outDto = new CreateUserOutDto ();
        outDto.userId = null;

        User existingUser = null;

        if (dto.fullname == null) {
            outDto.message = "You must specify a 'fullname'.";
            return outDto;
        }

        if (!dto.email.contains ("@")) {
            outDto.message = "Your email address is not valid";
            return outDto;
        }


        if (dto.username != null) {
            existingUser = userRepository.getUserByUsername (dto.username);
            if (existingUser != null) {
                outDto.message = "User exists";
                return outDto;
            }

            //TODO: ideally we should
            if (dto.username.contains ("@")) {
                outDto.message = "Username must not contain the '@' character";
            }
        } else {
            // if no user name was given we try to assign a random username

            for (int i = 0; i < 10; i++) {
                OptionalLong randomCandidate = new Random ().ints (10000, 9999999)
                                                            .asLongStream ()
                                                            .findAny ();

                if (!randomCandidate.isPresent ()) {
                    continue;
                }
                Long number = randomCandidate.getAsLong ();
                dto.username = "user" + String.format ("%07d", number);

                existingUser = userRepository.getUserByUsername (dto.username);

                // the username does not exist yet, so break;
                if (existingUser == null) {
                    break;
                }
            }

            // we have tried 10 time, but all randomly generated usernames already exist
            if (existingUser != null) {
                outDto.message = "Please try again or specify a username.";
                return outDto;
            }
        }

        String encodedPassword = passwordEncoder.encode (dto.password);

        User user = new User (dto.fullname, dto.email, dto.username, encodedPassword);

        List<Role> roles;

        // default to the role STUDENT if no roles were given
        if (dto.roles.size () == 0) {
            roles = new ArrayList<> ();
            roles.add (roleRepository.findRoleByName ("STUDENT"));
        } else {
            roles = dto.roles.stream ()
                             .map (role -> roleRepository.findRoleByName (role))
                             .collect (Collectors.toList ());
        }

        user.getRoles ().addAll (roles);

        userRepository.save (user);

        outDto.userId = user.id;

        return outDto;
    }

    @CrossOrigin
    @PreAuthorize (value = "hasRole('ADMIN')")
    @RequestMapping (method = RequestMethod.DELETE, path = "{username}")
    public Boolean
    deleteUser (@PathVariable String username)
    {
        User userByUsername = userRepository.getUserByUsername (username);

        if (userByUsername != null) {
            userRepository.delete (userByUsername);
            return true;
        }

        return false;
    }

    @CrossOrigin
    @RequestMapping (method = RequestMethod.POST, path = "/current/password")
    @Transactional
    public ChangePasswordOutDto
    changePassword (@RequestBody ChangePasswordDto dto) {
        ChangePasswordOutDto outDto = new ChangePasswordOutDto ();

        Object principal = SecurityContextHolder.getContext ().getAuthentication ().getPrincipal ();

        if (principal instanceof User) {
            User currentUser = (User) principal;

            if (passwordEncoder.matches (dto.oldPassword, currentUser.password)) {
                currentUser.password = passwordEncoder.encode (dto.newPassword);
                userRepository.save (currentUser);

                outDto.passwordChanged = true;

            } else {
                outDto.passwordChanged = false;
            }
        }

        return outDto;
    }
}
