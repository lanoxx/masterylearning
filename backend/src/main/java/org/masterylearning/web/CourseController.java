package org.masterylearning.web;

import org.masterylearning.domain.Course;
import org.masterylearning.domain.Entry;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.repository.CourseRepository;
import org.masterylearning.repository.EntryRepository;
import org.masterylearning.service.TreeEnumerator;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping (value = "/course")
public class CourseController {

    @Inject CourseRepository courseRepository;
    @Inject EntryRepository entryRepository;

    @RequestMapping
    public Course getCourse (long id) {
        Course course = courseRepository.findOne (id);

        return course;
    }

    @RequestMapping (method = RequestMethod.POST, consumes = "application/json")
    public Long createCourse(@RequestBody Course course) {

        // when saving a course we need to iterate its full tree and save each object individually

        courseRepository.save(course);

        return course.id;
    }

    @RequestMapping (path = "/{courseId}/enumerated")
    @Transactional
    public List<EntryDataOutDto> enumerateEntries (@PathVariable Long courseId) {

        Course course = courseRepository.getOne (courseId);

        Entry root = course.next ();

        TreeEnumerator treeEnumerator = new TreeEnumerator (root, entry -> "continue-button".equals (entry.data.type) || "exercise".equals (entry.data.type));

        return treeEnumerator.enumerateTree ();

    }

    @RequestMapping (value = "/dummy")
    public Long createDummyCourse () {
        Course course = new Course();
        course.title = "Formal Methods";
        course.description = "Formal Methods description";

        Entry entry1 = new Entry();
        course.children = new ArrayList<>();
        course.children.add(entry1);
        entry1.depth = 0;
        entry1.index = 0;

        Entry entry2 = new Entry();
        entry2.depth = 1;
        entry2.index = 0;
        entry1.children = new ArrayList<>();
        entry1.children.add(entry2);
        entry2.parent = entry1;

        course = courseRepository.save(course);
        return course.id;
    }

}
