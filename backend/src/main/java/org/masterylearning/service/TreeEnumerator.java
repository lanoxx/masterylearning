package org.masterylearning.service;

import org.masterylearning.domain.Entry;
import org.masterylearning.domain.data.EntryData;
import org.masterylearning.dto.out.EntryDataOutDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

/**
 */
public class TreeEnumerator {

    public Stack<Entry> entryStack = new Stack<> ();
    private BlockingStrategy blockingStrategy;

    public TreeEnumerator (Entry root, BlockingStrategy blockingStrategy) {
        this.entryStack.push (root);
        this.blockingStrategy = blockingStrategy;
    }

    public List<EntryDataOutDto> enumerateTree () {

        List<EntryDataOutDto> entries = new ArrayList<> ();
        Entry currentEntry;
        Entry next;

        currentEntry = this.entryStack.pop();

        EntryData data = currentEntry.getData ();

        entries.add (data.toDto ());

        while ((currentEntry = currentEntry.next ()) != null)
        {
            if (this.blockingStrategy.blocks (currentEntry))
            {
                entries.add (currentEntry.getData ().toDto ());

                next = currentEntry.next ();
                if (next != null)
                    this.entryStack.push (next);

                return entries;
            }

            entries.add (currentEntry.getData ().toDto ());
        }

        return entries;
    }
}
