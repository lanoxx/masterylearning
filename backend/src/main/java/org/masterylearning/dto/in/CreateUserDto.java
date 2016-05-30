package org.masterylearning.dto.in;

import java.util.ArrayList;
import java.util.List;

/**
 */
public class CreateUserDto {
    public String fullname;
    public String email;
    public String username;
    public String password;
    public List<String> roles = new ArrayList<> ();
}
