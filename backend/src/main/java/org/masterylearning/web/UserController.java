package org.masterylearning.web;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.masterylearning.domain.PasswordResetToken;
import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.domain.ValidationIssue;
import org.masterylearning.domain.ValidationResult;
import org.masterylearning.dto.CreateUsersOutDto;
import org.masterylearning.dto.RolesDto;
import org.masterylearning.dto.RolesOutDto;
import org.masterylearning.dto.in.ChangePasswordDto;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.dto.out.ChangePasswordOutDto;
import org.masterylearning.dto.out.CreateUserOutDto;
import org.masterylearning.dto.out.UserOutDto;
import org.masterylearning.repository.PasswordResetTokenRepository;
import org.masterylearning.repository.UserRepository;
import org.masterylearning.service.RoleService;
import org.masterylearning.service.UserService;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 */
@RestController
@RequestMapping (path = "users")
public class UserController {

    private Logger log = LogManager.getLogger (UserController.class);

    private UserRepository userRepository;
    private PasswordResetTokenRepository passwordResetTokenRepository;
    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private RoleService roleService;
    private Environment environment;

    public UserController (UserRepository userRepository,
                           PasswordResetTokenRepository passwordResetTokenRepository,
                           UserService userService,
                           PasswordEncoder passwordEncoder,
                           RoleService roleService,
                           Environment environment)
    {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
        this.environment = environment;
    }

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
    @RequestMapping (method = RequestMethod.GET)
    @Transactional
    public List<UserOutDto>
    getUserList () {

        List<User> userList = userRepository.findAll ();

        return userList.stream ().map (UserOutDto::new).collect (Collectors.toList ());
    }

    @CrossOrigin
    @PreAuthorize (value = "hasRole('ADMIN')")
    @RequestMapping (method = RequestMethod.POST)
    public CreateUserOutDto
    createUser (@RequestBody CreateUserDto dto) {


        // default to the role STUDENT if no roles were given
        if (dto.roles.size () == 0) {
            dto.roles.add ("STUDENT");
        }

        return createUserFromDto (dto);
    }

    public CreateUserOutDto createUserFromDto (@RequestBody CreateUserDto dto) {
        CreateUserOutDto outDto = new CreateUserOutDto ();
        outDto.success = false;
        outDto.email = dto.email;
        outDto.fullname = dto.fullname;

        ValidationResult validationResult = userService.validateCreateUserDto (dto);
        if (!validationResult.valid) {
            outDto.message = validationResult.issue.getMessage ();
            return outDto;
        }

        if (validationResult.issue == ValidationIssue.USERNAME_MISSING) {
            String username = userService.generateDefaultUsername ();

            if (username == null) {
                outDto.message = "Please try again or specify a username.";
                return outDto;
            } else {
                dto.username = username;
                outDto.message = validationResult.issue.getMessage ();
            }
        }

        User user = userService.createUser (dto);

        outDto.success = true;
        outDto.userId = user.id;
        outDto.username = user.username;
        outDto.roles = user.getRoles ().stream ().map (role -> role.name).collect (Collectors.toList ());
        return outDto;
    }


    @PreAuthorize (value = "hasRole ('ADMIN')")
    @RequestMapping (method = RequestMethod.POST, path = "import")
    public CreateUsersOutDto
    createUsers (@RequestBody CreateUsersDto dto) {
        CreateUsersOutDto outDto = new CreateUsersOutDto ();

        Map<ValidationResult, CreateUserDto> validationResultMap = userService.validateCreateUsersDto (dto);

        if (validationResultMap.size () > 0) {

            for (ValidationResult validationResult : validationResultMap.keySet ()) {

                CreateUserDto createUserDto = validationResultMap.get (validationResult);

                if (!validationResult.valid) {

                    dto.users.remove (createUserDto);

                    CreateUserOutDto userOutDto = new CreateUserOutDto ();
                    userOutDto.message = validationResult.issue.getMessage ();
                    userOutDto.fullname = createUserDto.fullname;
                    userOutDto.email = createUserDto.email;
                    userOutDto.success = false;

                    outDto.users.add (userOutDto);
                } else {

                    CreateUserOutDto userOutDto = new CreateUserOutDto ();
                    userOutDto.email = createUserDto.email;
                    userOutDto.fullname = createUserDto.fullname;

                    try {

                        String from = environment.getProperty ("email.from");

                        User user = userService.importUser (createUserDto, from);

                        userOutDto.userId = user.id;
                        userOutDto.username = user.username;
                        userOutDto.roles = user.getRoles ().stream ().map (role -> role.name).collect (Collectors.toList ());

                        userOutDto.success = true;

                    } catch (MailException e) {

                        log.error (e.getMessage ());

                        userOutDto.success = false;
                        userOutDto.message = "Could not create user because sending mail to user failed.";

                        outDto.users.add (userOutDto);

                        return outDto;

                    } catch (Exception e) {

                        userOutDto.success = false;
                        userOutDto.message = "An unknown error occurred while importing this user.";

                        outDto.users.add (userOutDto);

                        return outDto;
                    }
                }
            }
        }

        return outDto;
    }

    @Transactional
    @CrossOrigin
    @PreAuthorize (value = "hasRole('ADMIN')")
    @RequestMapping (method = RequestMethod.DELETE, path = "{username}")
    public Boolean
    deleteUser (@PathVariable String username)
    {
        User userByUsername = userRepository.getUserByUsername (username);

        if (userByUsername != null) {
            List<PasswordResetToken> passwordResetTokenByUser_username = passwordResetTokenRepository.findPasswordResetTokenByUser_Username (username);

            passwordResetTokenRepository.deleteInBatch (passwordResetTokenByUser_username);

            userRepository.delete (userByUsername);
            return true;
        }

        return false;
    }

    @PreAuthorize (value = "hasRole('ADMIN')")
    @RequestMapping (method = RequestMethod.POST, path = "{username}/roles")
    public RolesOutDto
    updateRoles (@PathVariable String username, @RequestBody RolesDto dto)
    {
        RolesOutDto result = new RolesOutDto();

        User userByUsername = userRepository.getUserByUsername (username);

        List<Role> rolesAdded = roleService.addRolesFromDto (userByUsername,
                                                             dto.rolesToAdd);

        List<Role> rolesDeleted = roleService.deleteRolesFromDto (userByUsername,
                                                                  dto.rolesToDelete);

        result.rolesAdded = rolesAdded.stream ()
                                      .map (role -> role.name)
                                      .collect(Collectors.toList());

        result.rolesDeleted = rolesDeleted.stream ()
                                          .map (role -> role.name)
                                          .collect (Collectors.toList ());

        return result;
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
