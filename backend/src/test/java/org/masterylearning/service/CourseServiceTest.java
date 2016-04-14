package org.masterylearning.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.BlockJUnit4ClassRunner;
import org.masterylearning.domain.Course;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.data.Section;

import static org.junit.Assert.assertTrue;

/**
 */
@RunWith (BlockJUnit4ClassRunner.class)
public class CourseServiceTest {

    private CourseService courseService = new CourseService ();

    @Test
    public void testFind () {
        Course course = createCourse ();

        Entry entry = courseService.find (course, 3L);

        assertTrue (checkSectionTitle (entry, "C"));

        entry = courseService.find (course, 2L);

        assertTrue (checkSectionTitle (entry, "B"));

        entry = courseService.find (course, 1L);

        assertTrue (checkSectionTitle (entry, "A"));

        entry = courseService.find (course, 4L);

        assertTrue (checkSectionTitle (entry, "D"));
    }

    private Course createCourse () {
        Course course = new Course ();
        course.id = 1L;

        Entry a = course.insert (new Section ("A"));
        a.id = 1L;

        Entry b = a.insert (new Section ("B"));
        b.id = 2L;

        Entry c = b.insert (new Section ("C"));
        c.id = 3L;

        Entry d = b.insert (new Section ("D"));
        d.id = 4L;

        return course;
    }

    private boolean checkSectionTitle (Entry entry, String title) {
        if (entry.getData () instanceof Section && "section".equals (entry.getData ().type)) {
            Section section = (Section) entry.data;
            return section.title.equals (title);
        }

        return false;


    }
}
