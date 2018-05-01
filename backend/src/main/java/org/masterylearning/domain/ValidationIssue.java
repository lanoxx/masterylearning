package org.masterylearning.domain;

/**
 */
public enum ValidationIssue {
    FULLNAME_MISSING ("You must specify a 'fullname'."),
    USERNAME_EXISTS ("User exists"),
    USERNAME_INVALID ("The username does not match the username requirements."),
    USERNAME_MISSING ("The username was missing. A default username has been generated."),
    EMAIL_EXISTS ("This email address is already registered by another user."),
    EMAIL_INVALID ("Your email address is not valid"),
    PASSWORD_MISSING ("The password was missing. A default password has been generated.");

    String message;

    public String getMessage() {
        return message;
    }

    ValidationIssue (String message) {
        this.message = message;
    }
}
