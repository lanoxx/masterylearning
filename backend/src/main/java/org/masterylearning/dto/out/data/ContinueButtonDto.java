package org.masterylearning.dto.out.data;

import org.masterylearning.domain.data.ContinueButton;
import org.masterylearning.dto.out.EntryDataOutDto;

/**
 */
public class ContinueButtonDto extends EntryDataOutDto {

    public ContinueButtonDto () { }

    public ContinueButtonDto (ContinueButton data) {
        super (data);
    }
}
