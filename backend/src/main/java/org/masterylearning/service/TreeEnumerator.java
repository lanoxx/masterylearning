package org.masterylearning.service;

import org.masterylearning.domain.Course;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.EntryHistory;
import org.masterylearning.domain.User;
import org.masterylearning.domain.data.EntryData;
import org.masterylearning.domain.data.Exercise;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

/**
 */
public class TreeEnumerator {

    public Stack<Entry> entryStack = new Stack<> ();
    private BlockingStrategy blockingStrategy;
    private final User user;
    private HistoryService historyService;

    public TreeEnumerator (User user, Entry root, HistoryService historyService, BlockingStrategy blockingStrategy) {
        this.user = user;
        this.historyService = historyService;
        this.entryStack.push (root);
        this.blockingStrategy = blockingStrategy;
    }

    @Transactional
    public List<EntryData> enumerateTree () {

        List<EntryData> entries = new ArrayList<> ();
        Entry currentEntry;
        Entry next;

        currentEntry = this.entryStack.pop();

        while (currentEntry != null)
        {
            entries.add (currentEntry.getData ());

            if (this.blockingStrategy.blocks (currentEntry))
            {
                next = currentEntry.next ();
                if (next != null)
                    this.entryStack.push (next);

                return entries;
            }

            if (currentEntry.data instanceof Exercise) {
                //insert new code here:
                // if currentEntry instanceof Exercise and exercise is answered
                // push current entry on stack
                // then enumerate sub tree for correct or incorrect branches

                Exercise exerice = (Exercise) currentEntry.data;

                // TODO: get the EntryHistory for the currentEntry
                //   -> requires course and user

                boolean answeredCorrect = false;

                Course course = currentEntry.getRootCourse ();
                EntryHistory entryHistory = historyService.findEntryHistory (user, course.id, currentEntry.id);
                // By definition, the exercise state's first token
                // must be whether the exercise was answered correctly;
                String exerciseResult = entryHistory.state.split (";")[0];
                if (exerciseResult != null) {
                    answeredCorrect = exerciseResult.equals ("true");
                }

                entryStack.push (currentEntry.next ());

                if (answeredCorrect) {
                    currentEntry =exerice.correct;
                } else {
                    currentEntry = exerice.incorrect;
                }
            } else {
                currentEntry = currentEntry.next ();
            }
            // if there is no next entry we have reached the end of the current tree
            // but we still need to check if we were in a subtree
            if (currentEntry == null && !entryStack.empty ()) {
                currentEntry = entryStack.pop ();
            }
        }

        return entries;
    }
}
