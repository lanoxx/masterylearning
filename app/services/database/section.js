angular.module ('myapp.factories.section', ['myapp.factories.entrydata'])

    .factory ('Section', ['$log', 'EntryData', function ($log, EntryData)
    {
        "use strict";

        /**
         * A section represents a part of a lecture that groups related topics. It usually contains subsections and
         * units.
         *
         * @author Sebastian Geiger
         *
         * @param title
         * @param description
         * @constructor
         */
        function Section (title, description)
        {
            EntryData.call (this, null, 'section');
            this.title = title;
            this.description = description;
        }

        Section.prototype = Object.create (EntryData.prototype);
        Section.prototype.constructor = Section;

        Section.prototype.toString = function (prefix)
        {
            prefix = prefix || "";
            return "Section (id=" + this.id + ", type=" + this.type + ", course_id=" + this.course_id +
                         ", title=" + this.title + ", description=" + this.description + ")";
        };

        return Section;
    }]);
