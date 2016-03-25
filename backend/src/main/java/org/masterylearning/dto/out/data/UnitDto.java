package org.masterylearning.dto.out.data;

import org.masterylearning.domain.data.Unit;
import org.masterylearning.dto.out.EntryDataOutDto;

/**
 */
public class UnitDto extends EntryDataOutDto {
    public String fullTitle;
    public String breadcrumbTitle;
    public Long prevUnitId;
    public Long nextUnitId;

    public UnitDto () { }

    public UnitDto (Unit data) {

        super (data);

        this.fullTitle = data.fullTitle;
        this.breadcrumbTitle = data.breadcrumbTitle;
        this.prevUnitId = data.prevUnitId;
        this.nextUnitId = data.nextUnitId;
    }
}
