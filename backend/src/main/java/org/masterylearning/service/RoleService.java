package org.masterylearning.service;

import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.masterylearning.repository.RoleRepository;
import org.masterylearning.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * RoleService offers methods to change the roles of a user
 */
@Service
public class RoleService {

    @Inject RoleRepository roleRepository;
    @Inject UserRepository userRepository;

    @Transactional
    public List<Role> addRoles (User user, List<Role> roles) {

        boolean found;

        List<Role> rolesAdded = new LinkedList<> ();

        for (Role role : roles) {
            found = user.getRoles ()
                        .stream ()
                        .anyMatch (userRole -> userRole.name != null && userRole.name.equals (role.name));

            if (!found) {
                user.getRoles ().add (role);
                rolesAdded.add (role);
            }
        }

        userRepository.save (user);

        return rolesAdded;
    }

    @Transactional
    public List<Role> addRolesFromDto (User user, List<String> roles) {
        List<Role> rolesFromDto = getRolesFromDto (roles);

        return addRoles (user, rolesFromDto);
    }

    @Transactional
    public List<Role> deleteRoles (User user, List<Role> roles) {

        List<Role> rolesToDelete = new LinkedList<> ();

        for (Role role : roles) {
            List<Role> foundRoles = user.getRoles ()
                                     .stream ()
                                     .filter (userRole -> userRole.name != null && userRole.name.equals (role.name)).collect (Collectors.toList ());

            rolesToDelete.addAll (foundRoles);
        }

        user.getRoles ().removeAll (rolesToDelete);

        userRepository.save (user);

        return rolesToDelete;
    }

    @Transactional
    public List<Role> deleteRolesFromDto (User user, List<String> roles) {

        List<Role> rolesFromDto = getRolesFromDto (roles);

        return deleteRoles (user, rolesFromDto);
    }

    public List<Role> getRolesFromDto (List<String> roles) {

        return roles.stream ()
                        .map (role -> roleRepository.findRoleByName (role))
                        .filter (Objects::nonNull)
                        .collect (Collectors.toList ());
    }
}
