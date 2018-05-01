package org.masterylearning;

import org.masterylearning.dto.in.CreateUserDto;

import java.util.Arrays;

/**
 */
public class UserUtility {
    /**
     * @return An initially valid dto object. During testing we will selectively
     * reset fields to check if the validation fails.
     */
    public static CreateUserDto getCreateUserDto () {
        CreateUserDto dto = new CreateUserDto ();

        dto.fullname = "John Doe";
        dto.email = "john@doe.com";

        // a correct username can be upper and lower case, contain a hypen and digits
        dto.username = "J0hN-Doe-33";
        dto.password = "123456";
        dto.roles = Arrays.asList ("STUDENT", "TEACHER");

        return dto;
    }

}
