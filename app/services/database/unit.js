angular.module ('myapp.factories.unit', ['myapp.factories.entry'])

    .factory ('Unit', ['$log', 'Entry', function ($log, Entry)
    {
        "use strict";

        /**
         * A unit represents a collection of entries such as paragraphs, definitions or exercises for a given topic.
         *
         * @author Sebastian Geiger
         *
         * @param full_title
         * @param breadcrumb_title
         * @param description
         * @param prev
         * @constructor
         */
        function Unit (full_title, breadcrumb_title, description, prev)
        {
            Entry.call (this, 'unit');
            this.full_title = full_title;
            this.breadcrumb_title = breadcrumb_title;
            this.description = description;

            if (prev != null) {
                this.prev = prev.id;
                prev.next = this.id;
            } else {
                this.prev = null;
            }

            this.next = null;
            this.entries = [];
        }

        Unit.prototype = Object.create (Entry.prototype);
        Unit.prototype.constructor = Unit;

        Unit.prototype.add_entry = function (entry)
        {
            if (this.course_id === null)
                throw new Error ("Unit " + this.id + " not yet added to a course.");

            this.entries.push (entry);
            entry.course_id = this.course_id;
            entry.parent_entry_id = this.id;

            return this;
        };

        Unit.prototype.toString = function (prefix)
        {
            var result = "Unit (id=" + this.id + ", type=" + this.type + ", full_title=" + this.full_title + ", breadcrumb_title=" + this.breadcrumb_title + ", description=" + this.description;

            var prev_id = this.prev ? this.prev.id : "null";
            var next_id = this.next ? this.next.id : "null";

            result += ", prev=" + prev_id + ", next=" + next_id + ", course_id=" + this.course_id + ", entries=[\n";

            this.entries.forEach (function (entry)
            {
                result += prefix + "\t" + entry.toString (prefix + "\t") + "\n";
            });

            result += prefix + "])";
            return result;
        };

        return Unit;
    }]);
