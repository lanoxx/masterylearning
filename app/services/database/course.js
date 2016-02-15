angular.module ('myapp.factories.course', [])

    .factory ('Course', ['$log', function ($log)
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

        Course.prototype.add_entry = function (entry)
        {
            this.entries.push (entry);
            entry.course_id = this.id;
        };

        Course.prototype.print = function ()
        {
            var result = "[myApp] Course (id=" + this.id + ", title=" + this.title + ", period=" + this.period + ", description=" + this.description;

            result += ", entries=[\n";

            this.entries.forEach (function (entry)
            {
                result += "\t" + entry.toString ("\t") + "\n"
            });

            result += "])";

            $log.info (result);
        };

        return Course;

    }]);
