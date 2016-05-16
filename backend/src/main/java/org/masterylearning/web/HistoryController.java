package org.masterylearning.web;

import org.masterylearning.domain.Course;
import org.masterylearning.domain.CourseHistory;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.EntryHistory;
import org.masterylearning.dto.out.CourseHistoryOutDto;
import org.masterylearning.dto.out.CourseOutDto;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.repository.CourseRepository;
import org.masterylearning.service.CourseService;
import org.masterylearning.service.HistoryService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 */
@RestController
@RequestMapping (path = "/userHistory")
public class HistoryController {

    @Inject CourseRepository courseRepository;
    @Inject CourseService courseService;
    @Inject HistoryService historyService;

    @CrossOrigin
    @RequestMapping (method = RequestMethod.GET, path = "/activeCourses")
    @Transactional
    public List<CourseHistoryOutDto> getActiveCourses () {
        List<Course> all = courseRepository.findAll ();

        // This is a temporary workaround. We add all courses to the users list of active courses.
        // In a future version we should have a means to register a student for a course, which would
        // then put that course into the students list of active courses. Once this is in place we could
        // load the list of active courses for the currently authenticated user here, rather then
        // loading all courses from the database.
        List<CourseHistory> courseHistories = historyService.addActiveCourses (all);

        List<CourseHistoryOutDto> results = new ArrayList<> ();

        results.addAll (courseHistories.stream ()
                                       .map (toDto ())
                                       .collect (Collectors.toList()));

        return results;
    }

    private Function<CourseHistory, CourseHistoryOutDto> toDto () {
        return courseHistory -> {
            CourseHistoryOutDto courseHistoryOutDto = new CourseHistoryOutDto ();
            courseHistoryOutDto.courseOutDto = new CourseOutDto (courseHistory.course);
            if (courseHistory.lastEntry != null) {
                courseHistoryOutDto.lastEntryId = courseHistory.lastEntry.id;
            }

            return courseHistoryOutDto;
        };
    }

    @CrossOrigin
    @RequestMapping (method = RequestMethod.GET, path = "/courses/{courseId}")
    @Transactional
    public List<EntryDataOutDto> getTableOfContents (@PathVariable Long courseId) {
        Course course;
        List<Entry> tableOfContents;
        CourseHistory courseHistory;
        List<EntryHistory> entryHistoryList;

        if (courseId == null) {
            return null;
        }

        course = courseRepository.findOne (courseId);

        tableOfContents = courseService.getTableOfContents (course);

        courseHistory = historyService.getCourseHistory (courseId);

        entryHistoryList = courseHistory.getEntryHistoryList ();

        List<EntryDataOutDto> result = new ArrayList<> ();
        if (tableOfContents != null) {
            for (Entry entry : tableOfContents) {
                EntryDataOutDto outDto = entry.data.toDto ();
                entryHistoryList.stream ()
                                .filter (entryHistory -> entry.id.equals (entryHistory.entry.id))
                                .forEach (entryHistory -> {
                                    outDto.state = entryHistory.state;
                                    outDto.seen = true;
                                });
                result.add (outDto);
            }
        }

        return result;
    }
}
