package org.masterylearning.service;

import org.masterylearning.domain.User;
import org.masterylearning.repository.UserRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.util.List;

/**
 */
@RestController
@RequestMapping (path = "/bootstrap")
public class InitializationController {

    @Inject UserRepository userRepository;

    @RequestMapping (method = RequestMethod.GET, path = "/users")
    public Boolean initUsers () {

        List<User> all = userRepository.findAll ();

        if (all.size () == 0) {

            User user = new User ("user", "123456");

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
