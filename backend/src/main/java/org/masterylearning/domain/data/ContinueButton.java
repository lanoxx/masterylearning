package org.masterylearning.domain.data;

import org.masterylearning.dto.out.data.ContinueButtonDto;

import javax.persistence.Entity;

@Entity (name = "ContinueButton")
public class ContinueButton extends EntryData {

    public ContinueButton () {
        this.type = "continue-button";
    }

    @Override
    public ContinueButtonDto toDto () {
        return new ContinueButtonDto (this);
    }
}
