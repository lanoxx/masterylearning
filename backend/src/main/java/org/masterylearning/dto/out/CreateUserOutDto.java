package org.masterylearning.dto.out;

import org.masterylearning.domain.User;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 */
public class CreateUserOutDto {
    public Boolean success;
    public String message;
    public List<String> messages = new ArrayList<> ();
    public Long userId;
    public String username;
    public String fullname;
    public String email;
    public List<String> roles;

    public void copyUserDetails (User user)
    {
        this.success = true;
        this.userId = user.id;
        this.fullname = user.fullname;
        this.username = user.username;
        this.email = user.email;

        this.roles = user.getRoles ()
                         .stream ()
                         .map (role -> role.name)
                         .collect (Collectors.toList ());
    }
}
