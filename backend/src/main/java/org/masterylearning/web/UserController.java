package org.masterylearning.web;

import org.masterylearning.domain.User;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.dto.out.CreateUserOutDto;
import org.masterylearning.dto.out.UserOutDto;
import org.masterylearning.repository.UserRepository;
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

/**
 */
@RestController
@RequestMapping (path = "users")
public class UserController {

    @Inject UserRepository userRepository;
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

    //TODO: add security role 'ADMIN'
    @CrossOrigin
    @RequestMapping (method = RequestMethod.POST)
    public CreateUserOutDto
    createUser (@RequestBody CreateUserDto dto) {
        CreateUserOutDto outDto = new CreateUserOutDto ();

        User existingUser = userRepository.getUserByUsername (dto.username);
        if (existingUser != null) {
            outDto.message = "User exists";
            outDto.userId = null;
        }

        String encodedPassword = passwordEncoder.encode (dto.password);

        User user = new User (dto.username, encodedPassword);

        userRepository.save (user);

        outDto.userId = user.id;

        return outDto;
    }

    @CrossOrigin
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
}
