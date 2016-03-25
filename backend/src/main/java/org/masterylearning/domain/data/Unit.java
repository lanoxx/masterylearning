package org.masterylearning.domain.data;

import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.dto.out.data.UnitDto;

import javax.persistence.Entity;

@Entity (name = "Unit")
public class Unit extends EntryData {
    public String fullTitle;
    public String breadcrumbTitle;
    public Long prevUnitId;
    public Long nextUnitId;

    public Unit () {
        this.type = "unit";
    }

    @Override
    public EntryDataOutDto toDto () {
        return new UnitDto (this);
    }
}
