angular.module ('myapp.factories.unit', ['myapp.factories.entrydata'])

    .factory ('Unit', ['$log', 'EntryData', function ($log, EntryData)
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
            EntryData.call (this, null, 'unit');
            this.full_title = full_title;
            this.breadcrumb_title = breadcrumb_title;
            this.description = description;

            if (prev != null) {
                this.prev = prev.container.id;
                prev.next = this.id;
            } else {
                this.prev = null;
            }

            this.next = null;
        }

        Unit.prototype = Object.create (EntryData.prototype);
        Unit.prototype.constructor = Unit;

        Unit.prototype.toString = function (prefix)
        {
            var result = "Unit (id=" + this.id + ", type=" + this.type + ", full_title=" + this.full_title + ", breadcrumb_title=" + this.breadcrumb_title + ", description=" + this.description;

            var prev_id = this.prev ? this.prev.id : "null";
            var next_id = this.next ? this.next.id : "null";

            result += ", prev=" + prev_id + ", next=" + next_id + ", course_id=" + this.container.course_id + ")";
            return result;
        };

        return Unit;
    }]);
