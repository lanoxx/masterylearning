package org.masterylearning.web;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.masterylearning.domain.Course;
import org.masterylearning.domain.CourseHistory;
import org.masterylearning.domain.Entry;
import org.masterylearning.dto.in.CourseUpdateDto;
import org.masterylearning.dto.out.CourseOutDto;
import org.masterylearning.dto.out.CreateCourseOutDto;
import org.masterylearning.dto.out.ValidationDto;
import org.masterylearning.repository.CourseHistoryRepository;
import org.masterylearning.repository.CourseRepository;
import org.masterylearning.repository.EntryRepository;
import org.masterylearning.service.CourseService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
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
    @Inject CourseHistoryRepository courseHistoryRepository;

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


    @CrossOrigin
    @RequestMapping (method = RequestMethod.POST, path = "/{courseId}")
    @Transactional
    public Boolean
    updateCourse (@PathVariable Long courseId, @RequestBody CourseUpdateDto dto) {

        if (courseId == null) {
            return false;
        }

        Course course = courseRepository.findOne (courseId);

        if (course == null) {
            return false;
        }

        if (dto.title != null) {
            course.title = dto.title;
        }

        if (dto.period != null) {
            course.period = dto.period;
        }

        if (dto.description != null) {
            course.description = dto.description;
        }

        courseRepository.save (course);

        return true;
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

    @PreAuthorize ("hasRole ('TEACHER') or hasRole ('ADMIN')")
    @RequestMapping (method = RequestMethod.DELETE, path = "/{courseId}")
    @Transactional
    public Boolean deleteCourse (@PathVariable Long courseId) {

        if (courseId == null) {
            return false;
        }

        List<CourseHistory> courseHistories = courseHistoryRepository.findByCourse_Id (courseId);

        courseHistories.forEach (courseHistory -> courseHistoryRepository.delete (courseHistory));

        courseRepository.delete (courseId);

        return true;
    }
}
