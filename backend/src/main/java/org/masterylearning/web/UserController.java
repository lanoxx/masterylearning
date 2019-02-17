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
import org.masterylearning.dto.in.CreateUsersInDto;
import org.masterylearning.dto.out.ChangePasswordOutDto;
import org.masterylearning.dto.out.CreateUserOutDto;
import org.masterylearning.dto.out.UserOutDto;
import org.masterylearning.repository.PasswordResetTokenRepository;
import org.masterylearning.repository.UserRepository;
import org.masterylearning.service.RoleService;
import org.masterylearning.service.UserService;
import org.masterylearning.web.validation.UserValidation;
import org.springframework.mail.MailException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.NoSuchElementException;
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
    private UserValidation userValidation;

    public UserController (UserRepository userRepository,
                           PasswordResetTokenRepository passwordResetTokenRepository,
                           UserService userService,
                           PasswordEncoder passwordEncoder,
                           RoleService roleService,
                           UserValidation userValidation)
    {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
        this.userValidation = userValidation;
    }

    @GetMapping(path = "/current")
    @Transactional
    public UserOutDto
    getUser () {
        Object principal = SecurityContextHolder.getContext ().getAuthentication ().getPrincipal ();
        if (principal instanceof User) {
            return new UserOutDto ((User) principal);
        }

        return null;
    }

    @GetMapping
    @Transactional
    public List<UserOutDto>
    getUserList () {

        List<User> userList = userRepository.findAll ();

        return userList.stream ().map (UserOutDto::new).collect (Collectors.toList ());
    }

    @PreAuthorize ("hasRole ('ADMIN')")
    @GetMapping(path = "{username:.+}")
    public UserOutDto
    findUser (@PathVariable String username) {
        User userByUsername = userRepository.getUserByUsername (username);

        if (userByUsername == null) {
            userByUsername = userRepository.getUserByEmail (username);
        }

        if (userByUsername == null) {
            throw new NoSuchElementException ("User with username or email: " + username + " not found.");
        }

        return new UserOutDto (userByUsername);
    }

    @PreAuthorize (value = "hasRole('ADMIN')")
    @PostMapping
    public CreateUserOutDto
    createUser (@RequestBody CreateUserDto dto) {

        return createUserFromDto (dto);
    }

    @PreAuthorize (value = "hasRole ('ADMIN')")
    @PostMapping (path = "import")
    public CreateUsersOutDto
    createUsers (@RequestBody CreateUsersInDto dto) {
        CreateUsersOutDto outDto = new CreateUsersOutDto ();

        for (CreateUserDto createUserDto : dto.users) {

            CreateUserOutDto createUserOutDto = createUserFromDto (createUserDto);

            // if creation was not successful we add the dto to the list, so we can
            // display a proper error message in the UI.
            if (!createUserOutDto.success) {
                outDto.users.add (createUserOutDto);
            }
        }

        return outDto;
    }

    CreateUserOutDto createUserFromDto (CreateUserDto dto) {
        CreateUserOutDto outDto = new CreateUserOutDto ();
        outDto.success = false;
        outDto.email = dto.email;
        outDto.fullname = dto.fullname;

        ValidationResult validationResult = userValidation.validateCreateUserDto (dto);
        if (!validationResult.valid) {
            outDto.message = validationResult.getFirstMessage ();
            return outDto;
        }

        if (validationResult.issues.contains (ValidationIssue.PASSWORD_MISSING)) {
            dto.password = userService.generateDefaultPassword ();
            outDto.messages.add (ValidationIssue.PASSWORD_MISSING.getMessage ());
        }

        if (validationResult.issues.contains (ValidationIssue.USERNAME_MISSING)) {
            String username = userService.generateDefaultUsername ();

            if (username == null) {
                outDto.message = "Please try again or specify a username.";
                return outDto;
            } else {
                dto.username = username;
                outDto.messages.add (ValidationIssue.USERNAME_MISSING.getMessage ());
            }
        }

        // default to the role STUDENT if no roles were given
        if (dto.roles.size () == 0) {
            dto.roles.add ("STUDENT");
        }

        try {
            User user = userService.createUser (dto);

            outDto.copyUserDetails (user);

        } catch (MailException e) {

            log.error (e.getMessage ());

            outDto.message = "Could not create user because sending mail to user failed.";

        } catch (Exception e) {

            outDto.message = "An unknown error occurred while creating this user.";
        }

        return outDto;
    }

    @Transactional
    @PreAuthorize (value = "hasRole('ADMIN')")
    @DeleteMapping(path = "{username}")
    public Boolean
    deleteUser (@PathVariable String username)
    {
        return userService.deleteUser (username);
    }

    @PreAuthorize (value = "hasRole('ADMIN')")
    @PostMapping(path = "{username}/roles")
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

    @PostMapping(path = "/current/password")
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
