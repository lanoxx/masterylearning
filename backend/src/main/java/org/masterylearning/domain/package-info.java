@TypeDefs({
    @TypeDef(name = "localDateType",
           defaultForType = LocalDate.class,
           typeClass = LocalDateUserType.class),
    @TypeDef(name = "localDateTimeType",
           defaultForType = LocalDateTime.class,
           typeClass = LocalDateTimeUserType.class),
    @TypeDef(name = "localTimeType",
           defaultForType = LocalTime.class,
           typeClass = LocalTimeUserType.class)
  })
package org.masterylearning.domain;

import be.progs.blog.LocalDateTimeUserType;
import be.progs.blog.LocalDateUserType;
import be.progs.blog.LocalTimeUserType;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
