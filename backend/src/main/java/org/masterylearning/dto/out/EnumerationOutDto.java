package org.masterylearning.dto.out;

import java.util.ArrayList;
import java.util.List;

/**
 */
public class EnumerationOutDto {
    public List<EntryDataOutDto> entries = new ArrayList<> ();
    public List<Long> nextIds;
    public Long scrollLocation; // location to which the browser should scroll after all entries have been rendered.
}
