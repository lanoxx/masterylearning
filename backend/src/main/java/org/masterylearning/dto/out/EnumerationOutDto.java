package org.masterylearning.dto.out;

import java.util.List;

/**
 */
public class EnumerationOutDto {
    public List<EntryDataOutDto> entries;
    public Long nextId;
    public Long scrollLocation; // location to which the browser should scroll after all entries have been rendered.
}
