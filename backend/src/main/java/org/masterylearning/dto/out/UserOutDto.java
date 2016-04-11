package org.masterylearning.dto.out;

import org.masterylearning.domain.User;

import java.util.List;
import java.util.stream.Collectors;

/**
 */
public class UserOutDto {

    public String username;
    public List<String> roles;

    public UserOutDto (User user) {

        this.username = user.username;
        this.roles = user.getRoles().stream ().map (role -> role.name).collect(Collectors.toList());

    }

}
