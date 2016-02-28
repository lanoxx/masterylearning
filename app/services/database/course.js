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

        Course.prototype.get_entry = function (id)
        {
            var entry;
            for (var i = 0, n = this.entries.length; i < n; i++)
            {
                entry = search (this.entries[i], id);
                if (entry !== null)
                    break;
            }

            return entry;

            function search (entry, id)
            {
                var candidate = null;

                if (entry.id === id)
                    candidate = entry;
                else {
                    for (var i = 0, n = entry.children.length; i < n; i++) {
                        candidate = search (entry.children[i], id);
                        if (candidate !== null)
                            break;
                    }
                }

                return candidate;
            }
        };

        Course.prototype.get_entries = function (type)
        {
            var entries = [];

            entries.push.apply (entries, collect(this.entries, type));

            function collect(entries, type)
            {
                var result = [];

                if (!entries || entries.length === 0)
                    return [];

                entries.forEach(function (entry)
                {
                    if (!type)
                        result.push(entry);
                    else if (type && entry.data.type === type)
                        result.push(entry);

                    if (entry.hasOwnProperty("children")) {
                        result.push.apply(result, collect(entry.children, type));
                    }
                });
                return result;
            }

            return entries;
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
