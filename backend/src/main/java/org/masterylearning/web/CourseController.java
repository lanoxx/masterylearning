package org.masterylearning.web;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.masterylearning.domain.Course;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.data.ContinueButton;
import org.masterylearning.domain.data.Exercise;
import org.masterylearning.dto.out.CourseOutDto;
import org.masterylearning.dto.out.CreateCourseOutDto;
import org.masterylearning.dto.out.EnumerationOutDto;
import org.masterylearning.dto.out.ValidationDto;
import org.masterylearning.repository.CourseRepository;
import org.masterylearning.repository.EntryRepository;
import org.masterylearning.service.CourseService;
import org.masterylearning.service.TreeEnumerator;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping (value = "/courses")
public class CourseController {

    Logger logger = LogManager.getLogger (CourseController.class);

    @Inject CourseRepository courseRepository;
    @Inject EntryRepository entryRepository;
    @Inject CourseService courseService;

    @CrossOrigin
    @RequestMapping (method = RequestMethod.GET)
    public List<CourseOutDto>
    getCourseList () {
        List<CourseOutDto> results = new ArrayList<> ();
        List<Course> all = courseRepository.findAll ();
        results.addAll (all.stream ().map (CourseOutDto::new).collect (Collectors.toList ()));
        return results;
    }

    @CrossOrigin (origins = "*",
                  allowCredentials = "true",
                  methods = {RequestMethod.GET})
    @RequestMapping (method = RequestMethod.GET, path = "/{courseId}")
    public List<Entry>
    getCourseOverview (@PathVariable Long courseId) {

        Course course = courseRepository.findOne (courseId);

        if (course != null) {
            return courseService.getTableOfContents (course);
        }

        return null;
    }

    /**
     * This returns the full course tree with all child elements except for cyclic references
     * which are removed during serialization.
     *
     * @param courseId
     * @return The course object from the database.
     */
    @PreAuthorize ("hasRole ('TEACHER') or hasRole ('ADMIN')")
    @RequestMapping (method = RequestMethod.GET, path = "/{courseId}/full")
    public Course
    getCourseFull (@PathVariable Long courseId) {

        Course course = courseRepository.findOne (courseId);

        logger.info ("Loaded course: " + (course != null ? course.id : "NULL"));

        return course;
    }

    @PreAuthorize ("hasRole ('TEACHER') or hasRole ('ADMIN')")
    @RequestMapping(method = RequestMethod.POST)
    public CreateCourseOutDto createCourse (@RequestBody Course course) {
        CreateCourseOutDto dto = new CreateCourseOutDto ();

        // we need to validate the course structure before saving it
        // validate also fills in the depth and index fields for the course, ideally validation should not
        // change any data so we should split that out into another method.
        ValidationDto validate = courseService.validate (course);

        if (validate.valid)
            courseRepository.save (course);

        dto.validationResult = validate;
        dto.courseId = course.id;

        return dto;
    }

    @CrossOrigin
    @RequestMapping(path = "/{courseId}/enumerate/{entryId}", method = RequestMethod.GET)
    @Transactional
    public EnumerationOutDto enumerateEntries (@PathVariable Long courseId, @PathVariable Long entryId) {
        Entry root;
        EnumerationOutDto dto = new EnumerationOutDto ();

        Course course = courseRepository.getOne (courseId);

        if (course == null) {
            //TODO return error
            return null;
        }

        root = courseService.find (course, entryId);

        TreeEnumerator treeEnumerator = new TreeEnumerator (root, entry -> entry.data instanceof ContinueButton || entry.data instanceof Exercise);

        dto.entries = treeEnumerator.enumerateTree ();

        if (treeEnumerator.entryStack.size () > 0) {
            Entry next = treeEnumerator.entryStack.peek ();
            dto.nextId = next.id;
        }

        return dto;
    }

    @CrossOrigin
    @RequestMapping(path = "/{courseId}/enumerate", method = RequestMethod.GET)
    @Transactional
    public EnumerationOutDto enumerateEntries (@PathVariable Long courseId)
    {
        Entry root;
        EnumerationOutDto dto = new EnumerationOutDto ();

        Course course = courseRepository.getOne (courseId);
        root = course.next ();

        TreeEnumerator treeEnumerator = new TreeEnumerator (root, entry -> entry.data instanceof ContinueButton || entry.data instanceof Exercise);

        dto.entries = treeEnumerator.enumerateTree ();
        Entry next = treeEnumerator.entryStack.peek ();
        if (next != null) {
            dto.nextId = next.id;
        }

        return dto;
    }
}
