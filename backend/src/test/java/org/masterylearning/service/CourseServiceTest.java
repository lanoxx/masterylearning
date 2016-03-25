package org.masterylearning.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.App;
import org.masterylearning.domain.Course;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.data.Section;
import org.masterylearning.repository.CourseRepository;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.inject.Inject;
import javax.transaction.Transactional;

import static org.junit.Assert.assertTrue;

/**
 */
@RunWith (SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(App.class)
public class CourseServiceTest {

    @Inject CourseService courseService;
    @Inject CourseRepository courseRepository;

    @Before
    public void before () {
        createCourse ();
    }

    @Test
    @Transactional
    public void testFind () {
        Course course = courseRepository.findOne (1L);

        Entry entry = courseService.find (course, 3L);

        assertTrue (checkSectionTitle (entry, "C"));

        entry = courseService.find (course, 2L);

        assertTrue (checkSectionTitle (entry, "B"));

        entry = courseService.find (course, 1L);

        assertTrue (checkSectionTitle (entry, "A"));

        entry = courseService.find (course, 4L);

        assertTrue (checkSectionTitle (entry, "D"));
    }

    private void createCourse () {
        Course course = new Course ();

        Entry a = course.insert (new Section ("A"));

        Entry b = a.insert (new Section ("B"));

        Entry c = b.insert (new Section ("C"));

        Entry d = b.insert (new Section ("D"));

        courseRepository.save (course);
    }

    private boolean checkSectionTitle (Entry entry, String title) {
        if ("section".equals (entry.data.type) &&entry.data instanceof Section) {
            Section section = (Section) entry.data;
            return section.title.equals (title);
        }

        return false;


    }
}
