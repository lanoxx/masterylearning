package org.masterylearning.dto.out;

import java.util.ArrayList;
import java.util.List;

/**
 */
public class ValidationDto {
    public boolean valid = true;
    public List<String> messages = new ArrayList<> ();

    public void validate (boolean valid, String message) {

        this.valid &= valid;

        if (!valid) {
            this.messages.add (message);
        }
    }
}
