package org.masterylearning.dto.out;

import org.masterylearning.domain.User;

import java.util.List;
import java.util.stream.Collectors;

/**
 */
public class UserOutDto {

    public String fullname;
    public String username;
    public String email;
    public List<String> roles;

    public UserOutDto (User user) {
        this.fullname = user.fullname;
        this.username = user.username;
        this.email = user.email;
        this.roles = user.getRoles().stream ().map (role -> role.name).collect(Collectors.toList());
    }

}
