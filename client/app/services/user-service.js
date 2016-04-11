angular.module ('myapp.services.user', ['ngResource', 'base64'])

    .factory ('UserService', ['$resource', '$http', '$base64', function UserServiceFactory($resource, $http, $base64)
    {
        function UserService()
        {
            var loggedIn = false;

            this.currentUser = null;
            this.role = "ROLE_GUEST";

            this.mode = "flow";
            this.isLoggedIn = function ()
            {
                return loggedIn;
            };

            this.logout = function ()
            {
                loggedIn = false;
            };

            this.login = function (username, password)
            {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode(username + ":" + password);

                var userOutDto = $resource ("http://localhost:8080/users/current", null, {method: 'GET' }).get();
                return userOutDto.$promise.then (function (result)
                {
                    this.role = "ROLE_STUDENT";
                    this.currentUser = result;
                    loggedIn = true;
                }.bind (this));
            };

            this.changePassword = function (oldpassword, newpassword)
            {
                var changePasswordResource = $resource ("http://localhost:8080/users/current/password");
                var success = changePasswordResource.save ( { oldPassword: oldpassword, newPassword: newpassword } );

                return success.$promise.then (function (result)
                    {
                        $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode (this.currentUser.username + ":" + newpassword);

                        return result;
                    }.bind (this),
                    function ()
                    {
                        $log.error ("[myApp] UserService.changePassword failed.")
                    }
                )
            };
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
