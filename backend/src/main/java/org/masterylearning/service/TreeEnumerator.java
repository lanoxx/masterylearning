package org.masterylearning.service;

import org.masterylearning.domain.Entry;
import org.masterylearning.dto.out.EntryDataOutDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

/**
 */
public class TreeEnumerator {

    private Stack<Entry> entryStack = new Stack<> ();
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

        entries.add (currentEntry.data.toDto ());

        while ((currentEntry = currentEntry.next ()) != null)
        {
            if (this.blockingStrategy.blocks (currentEntry))
            {
                entries.add (currentEntry.data.toDto ());

                next = currentEntry.next ();
                if (next != null)
                    this.entryStack.push (next);

                return entries;
            }

            entries.add (currentEntry.data.toDto ());
        }

        return entries;
    }
}
