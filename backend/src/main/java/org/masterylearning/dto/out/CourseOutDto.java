package org.masterylearning.dto.out;

import org.masterylearning.domain.Course;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 */
public class CourseOutDto {
    public Long id;

    public String title;
    public String subtitle;
    public String period;
    public String description;

    public List<Long> children = new ArrayList<> ();

    public CourseOutDto () { }

    public CourseOutDto (Course data) {
        this.id = data.id;

        this.title = data.title;
        this.period = data.period;
        this.description = data.description;

        this.children.addAll (data.children.stream ().map (child -> child.id).collect (Collectors.toList ()));
    }

}
