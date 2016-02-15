angular.module ('myapp.factories.entry', [])

    .factory ('Entry', ['$log', function ($log)
    {
        "use strict";

        /**
         * Entry represents a tree structure that holds the object which make up a course. The entry itself only models
         * the tree structure. Access the trees elements through the `data` property.
         *
         * @author Sebastian Geiger
         *
         * @param type
         * @constructor
         */
        function Entry (type)
        {
            this.id = Entry.get_next_id ();
            this.type = type;
            this.course_id = null;
        }

        Entry.get_next_id = (function ()
        {
            var id = 0;

            return function ()
            {
                return id++;
            };
        }) ();

        Entry.prototype.toString = function ()
        {
            return "Entry (id=" + this.id + ", type=" + this.type + ", course_id=" + this.course_id + ")";
        };

        $log.debug ('[myApp.factories] Entry function loaded');

        return Entry;
    }]);
