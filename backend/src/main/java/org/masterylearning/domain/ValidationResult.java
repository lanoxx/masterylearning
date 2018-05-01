package org.masterylearning.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 */
public class ValidationResult {
    public boolean valid;
    public List<ValidationIssue> issues = new ArrayList<> ();

    public String getFirstMessage () {

        if (issues.isEmpty ()) {
            return null;
        }

        return issues.get (0).getMessage ();
    }

    public List<String> getMessages () {
        return issues.stream ()
                     .map (ValidationIssue::getMessage)
                     .collect(Collectors.toList());
    }
}
