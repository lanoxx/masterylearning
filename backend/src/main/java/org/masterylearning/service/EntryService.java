package org.masterylearning.service;

import org.masterylearning.domain.Entry;
import org.masterylearning.dto.out.ValidationDto;
import org.springframework.stereotype.Service;


@Service
public class EntryService {


    public ValidationDto validate (ValidationDto validationDto, Entry child) {
        if (child.parent != null) {
            if (child.depth != child.parent.depth + 1) {
                child.depth = child.parent.depth + 1;
            }
        } else {
            child.depth = 0;
        }

        if (child.index != child.getIndex ()) {
            child.index = child.getIndex ();
        }

        if (child.children != null && child.children.size () > 0) {
            for (Entry entry : child.children) {
                validate (validationDto, entry);
            }
        }

        return validationDto;
    }
}
