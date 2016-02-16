angular.module ('myapp.factories.course', ['myapp.factories.entry'])

    .factory ('Course', ['$log', 'Entry', function ($log, Entry)
    {
        /**
         * Course is a database entity that represents the content of a univerity course for a certain semester.
         *
         * @author Sebastian Geiger
         *
         * @param id
         * @param title
         * @param period
         * @param description
         * @constructor
         */
        function Course (id, title, period, description)
        {
            this.id = id;
            this.title = title;
            this.period = period;
            this.description = description;
            this.entries = [];
        }

        Course.prototype.insert = function (entrydata)
        {
            var entry = new Entry(null, entrydata);

            entry.index = this.entries.length;
            this.entries.push(entry);
            entry.course_id = this.id;

            return entry;
        };

        Course.prototype.print = function ()
        {
            var result = "[myApp] Course (id=" + this.id + ", title=" + this.title + ", period=" + this.period + ", description=" + this.description + ",\n";
            var prefix = "                ";

            result += prefix + "entry=[\n";

            this.entries.forEach(function (entry)
            {
                result += entry.toString (prefix + "    ") + "\n";
            }, this);

            result += prefix + "])";

            $log.info (result);
        };

        return Course;

    }]);
