package org.masterylearning.repository;

import org.hibernate.Hibernate;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.domain.Course;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.data.Paragraph;
import org.masterylearning.domain.data.Section;
import org.masterylearning.domain.data.YesNoExercise;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.Assert.assertTrue;

/**
 * This is an integration test which requires the whole spring application context to be loaded. A possible improvement
 * might be to configure an in-memory hsqldb to test against.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class CourseRepositoryIT {

    @Inject CourseRepository courseRepository;

    /**
     * Test that a saved course retains its fields and that we can initialize its children
     */
    @Test
    @Transactional
    public void createCourse () {
        Course course = new Course();
        course.title = "Formal Methods";
        course.period = "2016";
        course.description = "Formal Methods description";

        courseRepository.save(course);

        assertTrue (course.id != null);

        Optional<Course> maybeCourse = courseRepository.findById (course.id);

        assertTrue (maybeCourse.isPresent ());

        course = maybeCourse.get ();

        Hibernate.initialize (course.children);

        assertTrue (course.title != null);
        assertTrue (course.period != null);
        assertTrue (course.description != null);
        assertTrue (course.children != null);
        assertTrue (course.children.size () == 0);
    }

    /**
     * Test that the course children are saved and loaded correctly
     */
    @Test
    @Transactional
    public void testCourseWithEntry () {
        Course course = new Course();
        Entry entry1 = new Entry();
        course.children.add(entry1);
        entry1.course = course;

        entry1.depth = 0;
        entry1.index = 0;

        courseRepository.save (course);

        Optional<Course> maybeCourse = courseRepository.findById (course.id);

        assertTrue (maybeCourse.isPresent ());

        course = maybeCourse.get ();

        Hibernate.initialize (course.children);

        assertTrue (course.children.size() == 1);

        entry1 = course.children.get (0);

        assertTrue (entry1.course == course);

        courseRepository.delete (course);
    }

    @Test
    public void testCourseWithNestedEntries () {
        Course course = new Course();
        Entry entry1 = new Entry();
        course.children.add(entry1);

        entry1.depth = 0;
        entry1.index = 0;

        Section section = new Section();
        section.title = "Section Title";
        section.description = "Section description";

        entry1.data = section;
        section.container = entry1;
        section.type = "section";

        Entry entry2 = new Entry();
        entry2.depth = 1;
        entry2.index = 0;
        entry1.children = new ArrayList<>();
        entry1.children.add(entry2);
        entry2.parent = entry1;

        Paragraph paragraph = new Paragraph();
        paragraph.text = "lorem ipsum";
        paragraph.paragraphType = "text";
        paragraph.type = "paragraph";

        entry2.data = paragraph;
        paragraph.container = entry2;

        Entry entry3 = new Entry();
        entry3.depth = 1;
        entry3.index = 1;

        YesNoExercise yesNoExercise = new YesNoExercise();
        entry3.data = yesNoExercise;
        yesNoExercise.container = entry3;

        entry1.children.add (entry3);

        course = courseRepository.save(course);

        assertTrue (course.id != null);

        assertTrue(course.children.size() == 1);

        assertTrue ("Expected entry1.id to be not null", entry1.id != null);
        assertTrue (entry1.children.size() == 2);

        assertTrue ("Expected section.id to be not null", section.id != null);
        assertTrue (section.container == entry1);

        assertTrue ("Expected entry2.id to be not null", entry2.id != null);
        assertTrue (entry2.parent == entry1);

        assertTrue ("Expected paragraph.id to be not null", paragraph.id != null);
        assertTrue (paragraph.container == entry2);

        courseRepository.delete (course);
    }
}
