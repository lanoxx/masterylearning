package org.masterylearning.domain;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.BlockJUnit4ClassRunner;
import org.masterylearning.domain.data.Section;

import static org.junit.Assert.assertTrue;

/**
 */
@RunWith (BlockJUnit4ClassRunner.class)
public class CourseTest {

    @Test
    public void createCourse () {
        /**
         * Setup the following hierarchy:
         *
         * course
         *   |- entry
         *   |  |- entry1
         *   |  |   \- entry2
         *   |  \- entry3
         *   |      \-entry4
         *   \- entry5
         */
        Course course = new Course ();

        Entry entry = course.insert (new Section ());

        Entry entry1 = entry.insert (new Section ());

        Entry entry2 = entry1.insert (new Section ());

        Entry entry3 = entry.insert (new Section ());

        Entry entry4 = entry3.insert (new Section ());

        Entry entry5 = course.insert (new Section ());

        assertTrue (course.hasNext ());

        assertTrue (course.next () == entry);

        assertTrue (entry.next () == entry1);

        assertTrue (entry1.next () == entry2);

        assertTrue (entry2.next () == entry3);

        assertTrue (entry3.next () == entry4);

        assertTrue (entry5.next () == null);
    }
}
