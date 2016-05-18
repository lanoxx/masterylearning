package org.masterylearning.service;

import org.masterylearning.domain.Course;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.data.Exercise;
import org.masterylearning.dto.out.ValidationDto;
import org.springframework.stereotype.Service;


@Service
public class EntryService {


    public ValidationDto validate (ValidationDto validationDto, Course course, Entry child) {
        if (child.parent != null) {
            if (child.depth != child.parent.depth + 1) {
                child.depth = child.parent.depth + 1;
            }
        } else {
            child.depth = 0;
        }

        if (child.rootCourse == null) {
            child.rootCourse = course;
        }

        if (child.index != child.getIndex ()) {
            child.index = child.getIndex ();
        }

        // we also need to validate the links leading from exercises back into the entry tree,
        // since the 'correct' and 'incorrect' exercises form an independent subtree.
        if (child.data instanceof Exercise) {
            Entry correct = ((Exercise) child.data).correct;
            if (correct != null)
                validate (validationDto, course, correct);

            Entry incorrect = ((Exercise) child.data).incorrect;
            if (incorrect != null)
                validate (validationDto, course, incorrect);
        }

        if (child.children != null && child.children.size () > 0) {
            for (Entry entry : child.children) {
                validate (validationDto, course, entry);
            }
        }

        return validationDto;
    }
}
