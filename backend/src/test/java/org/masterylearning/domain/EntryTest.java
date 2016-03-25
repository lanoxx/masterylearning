package org.masterylearning.domain;

import org.junit.Test;
import org.masterylearning.domain.data.Paragraph;
import org.masterylearning.domain.data.Section;
import org.masterylearning.domain.data.YesNoExercise;

import static org.junit.Assert.assertTrue;

/**
 */
public class EntryTest {

    @Test
    public void entryTest () {
        Course course = createCourse ();

        Paragraph paragraph = new Paragraph ();
        paragraph.text = "Paragraph 1";

        Entry paragraphEntry = course.next ().insert (paragraph);

        assertTrue (paragraph.container == paragraphEntry);
        assertTrue (paragraphEntry.depth == 1);
        assertTrue (paragraphEntry.index == 0);
        assertTrue (paragraphEntry.getIndex () == paragraphEntry.index);

        YesNoExercise yesNoExercise = new YesNoExercise ();
        yesNoExercise.text = "Some test to describe the execise question.";
        yesNoExercise.answer = true;

        Entry yesNoExerciseEntry = course.next ().insert (yesNoExercise);

        assertTrue (yesNoExercise.container == yesNoExerciseEntry);
        assertTrue (yesNoExerciseEntry.depth == 1);
        assertTrue (yesNoExerciseEntry.index == 1);
        assertTrue (yesNoExerciseEntry.getIndex () == yesNoExerciseEntry.index);

        Entry sectionEntry = course.next ().insert (new Section ());

        Entry nestedParagraphEntry = sectionEntry.insert (new Paragraph ());

        assertTrue (nestedParagraphEntry.depth == 2);
        assertTrue (nestedParagraphEntry.index == 0);
        assertTrue (nestedParagraphEntry.getIndex () == nestedParagraphEntry.index);
    }

    public Course createCourse () {
        Course course = new Course();

        course.insert (new Section ());

        return course;
    }
}
