package org.masterylearning.repository;

import org.hibernate.Hibernate;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.App;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.data.Section;
import org.masterylearning.domain.data.YesNoExercise;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.inject.Inject;
import javax.transaction.Transactional;

import static org.junit.Assert.assertTrue;

/**
 * This is an integration test which requires the whole spring application context to be loaded. A possible improvement
 * might be to configure an in-memory hsqldb to test against.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(App.class)
public class EntryRepositoryTest {

    @Inject EntryRepository entryRepository;

    @Test
    @Transactional
    public void createEntryWithData () {
        Entry entry1 = new Entry();

        entry1.depth = 5;
        entry1.index = 3;

        Section section = new Section();
        entry1.data = section;
        section.container = entry1;

        section.title = "Section Title";
        section.description = "Section description";

        entryRepository.save (entry1);

        entry1 = entryRepository.findOne (entry1.id);

        Hibernate.initialize (entry1.data);

        assertTrue (entry1.depth == 5);
        assertTrue (entry1.index == 3L);
        assertTrue (entry1.data != null);
        assertTrue (entry1.data.container != null);
        assertTrue ("section".equals (entry1.data.type));

        section = (Section) entry1.data;

        assertTrue (section.title != null);
        assertTrue (section.description != null);

    }

    @Test
    @Transactional
    public void createNestedEntries () {
        Entry entry1 = new Entry();
        Entry entry2 = new Entry();

        entry1.children.add(entry2);
        entry2.parent = entry1;

        entryRepository.save (entry1);

        entry1 = entryRepository.findOne (entry1.id);

        Hibernate.initialize (entry1.children);

        assertTrue (entry1.children.size () > 0);
    }

    @Test
    @Transactional
    public void createEntryWithYesNoExercise () {
        Entry entry1 = new Entry ();

        YesNoExercise exercise = new YesNoExercise ();
        exercise.type = "exercise";
    }

    @After
    public void deleteAll () {
        entryRepository.deleteAll ();
    }
}
