package org.masterylearning.dto.out.data;

import org.masterylearning.domain.data.Paragraph;
import org.masterylearning.dto.out.EntryDataOutDto;

/**
 */
public class ParagraphDto extends EntryDataOutDto {
    public int number;
    public String title;
    public String text;
    public String paragraphType;

    public ParagraphDto () { }

    public ParagraphDto (Paragraph data) {

        super (data);

        this.number = data.number;
        this.title = data.title;
        this.text = data.text;
        this.paragraphType = data.paragraphType;
    }
}
