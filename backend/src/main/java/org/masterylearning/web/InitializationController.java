package org.masterylearning.web;

import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.dto.out.CreateUserOutDto;
import org.masterylearning.repository.UserRepository;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.Arrays;

/**
 */
@RestController
@RequestMapping (path = "/bootstrap")
public class InitializationController {

    @Inject UserRepository userRepository;
    @Inject UserController userController;

    @RequestMapping (method = RequestMethod.POST, path = "/users")
    @Transactional
    public CreateUserOutDto createInitialUser (@RequestBody CreateUserDto dto) {

        long count = userRepository.count ();

        // WARNING: This endpoint has no security settings and is therefore accessible by anyone after
        //          the application has been started for the first time and when the database is still
        //          empty. This check is to ensure, that this bootstrap method can only be used to setup
        //          the initial user.
        if (count > 0) {
            CreateUserOutDto outDto = new CreateUserOutDto ();
            outDto.message = "This endpoint can only be used for the initial application setup.";
            return outDto;
        }

        // ensure that our initial user always has all the default roles
        dto.roles = Arrays.asList ("STUDENT", "TEACHER", "ADMIN");

        return userController.createUserFromDto (dto);
    }
}
