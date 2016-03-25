package org.masterylearning.web;

import org.masterylearning.domain.Entry;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.repository.EntryRepository;
import org.masterylearning.service.TreeEnumerator;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;

@RestController
@RequestMapping (value = "/entry")
public class EntryController {

    @Inject
    EntryRepository entryRepository;

    @RequestMapping
    @Transactional
    public List<EntryDataOutDto> getEntries (Long entryId) {

        Entry root = entryRepository.getEntryById (entryId);

        TreeEnumerator treeEnumerator = new TreeEnumerator (root, entry -> "continue-button".equals (entry.data.type) || "exercise".equals (entry.data.type));

        return treeEnumerator.enumerateTree ();
    }
}