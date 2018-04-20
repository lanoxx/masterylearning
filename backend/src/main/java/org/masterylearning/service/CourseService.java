package org.masterylearning.service;

import org.masterylearning.domain.Course;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.data.Exercise;
import org.masterylearning.dto.out.ValidationDto;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 */
@Service
public class CourseService {

    @Inject EntryService entryService;

    public ValidationDto validate (Course course) {

        ValidationDto validationDto = new ValidationDto ();

        // Validate course
        validationDto.validate (course.title != null, "Course title must not be empty.");
        validationDto.validate (course.period != null, "Course period must not be empty.");
        validationDto.validate (course.description != null, "Course description must not be empty.");
        if (course.description != null) {
            validationDto.validate (course.description.length () <= 3000,
                                    "Course description length must not exceed 3000 characters.");
        }

        for (Entry child : course.children) {
            // delegate validation to entry
            entryService.validate (validationDto, course, child);
        }

        return validationDto;
    }

    public List<Entry> getTableOfContents (Course course)
    {
        List<Entry> entries = course.getChildren ()
                                    .stream ()
                                    .filter (child -> "section".equals (child.data.type))
                                    .collect (Collectors.toList ());

        return entries;
    }


    @Transactional
    public Entry find (Course course, Long entryId) {
        Entry result;

        for (Entry child : course.getChildren ()) {
            result = findRecursive (child, entryId);

            if (result != null) {
                return result;
            }
        }

        return null;
    }

    private Entry findRecursive (Entry entry, Long entryId) {

        if (entryId.equals (entry.id))
            return entry;

        Entry result;

        for (Entry child : entry.getChildren ())
        {
            if (child.data instanceof Exercise) {
                Exercise exercise = (Exercise) child.data;

                if (exercise.correct != null) {
                    result = findRecursive (exercise.correct, entryId);
                    if (result != null)
                        return result;
                }

                if (exercise.incorrect != null) {
                    result = findRecursive (exercise.incorrect, entryId);
                    if (result != null)
                        return result;
                }
            }

            result = findRecursive (child, entryId);

            if (result != null) {
                return result;
            }
        }

        return null;
    }
}
