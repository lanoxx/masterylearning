package org.masterylearning.web;

import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.repository.UserRepository;
import org.masterylearning.service.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;

/**
 */
@RestController
@RequestMapping (path = "/bootstrap")
public class InitializationController {

    @Inject UserRepository userRepository;
    @Inject UserService userService;

    @RequestMapping (method = RequestMethod.GET, path = "/users")
    @Transactional
    public Boolean initUsers () {

        List<User> all = userRepository.findAll ();

        if (all.size () == 0) {

            User user = userService.createUser ("John Doe", "user", "123456");

            Role role = new Role ();
            role.name = "STUDENT";
            role.description = "";
            user.getRoles ().add (role);

            role = new Role ();
            role.name = "TEACHER";
            role.description = "";
            user.getRoles ().add (role);

            role = new Role ();
            role.name = "ADMIN";
            role.description = "";
            user.getRoles ().add (role);

            userRepository.save (user);

            return true;
        }

        return false;
    }

    @RequestMapping (method = RequestMethod.GET)
    public Boolean init () {
        return false;
    }
}
