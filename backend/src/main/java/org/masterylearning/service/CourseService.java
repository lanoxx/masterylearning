package org.masterylearning.service;

import org.masterylearning.domain.Course;
import org.masterylearning.domain.Entry;
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
        validationDto.validate (course.subtitle != null, "Course subtitle must not be empty.");
        validationDto.validate (course.period != null, "Course period must not be empty.");
        validationDto.validate (course.description != null, "Course description must not be empty.");

        for (Entry child : course.children) {
            // delegate validation to entry
            entryService.validate (validationDto, child);
        }

        return validationDto;
    }

    public List<Entry> getTableOfContents (Course course) {
        List<Entry> entries = course.getChildren ().stream ().filter (child -> "section".equals (child.data.type)).collect (Collectors.toList ());

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
        else {
            Entry result;
            for (Entry child : entry.getChildren ()) {
                result = findRecursive (child, entryId);
                if (result != null) {
                    return result;
                }
            }
        }

        return null;
    }
}
