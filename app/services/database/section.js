angular.module ('myapp.factories.section', ['myapp.factories.entry'])

    .factory ('Section', ['$log', 'Entry', function ($log, Entry)
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
            Entry.call (this, 'section');
            this.title = title;
            this.description = description;
            this.entries = [];
            this.parent_entry_id = null;
        }

        Section.prototype = Object.create (Entry.prototype);
        Section.prototype.constructor = Section;

        Section.prototype.add_entry = function (entry)
        {
            if (this.course_id === null)
                throw new Error ("Section " + this.id + " not yet added to a course.");

            this.entries.push (entry);
            entry.course_id = this.course_id;
            entry.parent_entry_id = this.id;

            return this;
        };

        Section.prototype.toString = function (prefix)
        {
            var result = "Section (id=" + this.id + ", type=" + this.type + ", title=" + this.title + ", description=" + this.description + ", course_id=" + this.course_id + ", entries=[\n";

            this.entries.forEach (function (entry)
            {
                result += prefix + "\t" + entry.toString (prefix + "\t") + "\n";
            });

            result += prefix + "])";
            return result;
        };

        return Section;
    }]);
