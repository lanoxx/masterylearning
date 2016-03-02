angular.module ('myapp.services.user', [])

    .factory ('UserService', [function UserServiceFactory()
    {
        function UserService()
        {
            this.currentUser = null;
            this.role = "ROLE_GUEST";

            /**
             *
             * @type {Array.<CourseHistory>}
             */
            this.active_courses = [];

            this.mode = "flow";
        }

        UserService.prototype.set_mode = function (mode)
        {
            this.mode = mode;
        };

        return new UserService();
    }])

    .factory ('CourseHistory', ['EntryHistory', function CourseHistoryFactory(EntryHistory)
    {
        /**
         * @param course_id:String
         * @constructor
         */
        function CourseHistory (course_id) {
            this.course_id = course_id;
            this.last_entry_id = null;
            this.visited_entries = [];
        }

        CourseHistory.prototype.set_last_entry = function (entry)
        {
            this.last_entry_id = entry.id;
        };

        CourseHistory.prototype.add_visited_entry = function (entry, state)
        {
            var visited_entry = new EntryHistory(entry, state);

            this.visited_entries.push (visited_entry);

            return visited_entry;
        };

        return CourseHistory;
    }])


    .factory ('EntryHistory', function EntryHistoryFactory ()
    {
        function EntryHistory (entry, state)
        {
            this.course_id = null;
            this.entry_id = entry.id;

            if (state !== undefined)
                this.state = state;
            else
                this.state = null;
        }

        /**
         * @param state:String The current state of the EntryData object.
         */
        EntryHistory.prototype.update_state = function (state)
        {
            this.state = state;
        };

        return EntryHistory;
    });
