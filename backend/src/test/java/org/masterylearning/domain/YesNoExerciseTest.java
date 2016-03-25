package org.masterylearning.domain;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.BlockJUnit4ClassRunner;
import org.masterylearning.domain.data.Section;
import org.masterylearning.domain.data.YesNoExercise;

import static org.junit.Assert.assertTrue;

/**
 */
@RunWith (BlockJUnit4ClassRunner.class)
public class YesNoExerciseTest {

    @Test
    public void testGetIndexForCorrectEntryinExercise () {
        YesNoExercise entryData = new YesNoExercise ();

        entryData.correct = new Entry (new Section ("Correct"));

        assertTrue (entryData.correct.getIndex () == 0);
    }

}
