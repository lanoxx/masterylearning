package org.masterylearning.dto.out;

import java.util.ArrayList;
import java.util.List;

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
}
