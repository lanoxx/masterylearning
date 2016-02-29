angular.module ('myapp.student.courses.entries.flow', ['ui.router', 'ngSanitize', 'myapp.student.courses.entries.exercises'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries.flow', {
            url: '/flow',
            resolve: {
                entry: ['database', 'course_id', 'entry_id', '$log', function (database, course_id, entry_id, $log)
                {
                    return database.get_course(course_id).get_entry (parseInt(entry_id, 10));
                }]
            },
            templateUrl: 'student/courses/entries/flow/flow.html',
            controller: 'FlowController'
        });
    }])

    .controller ('FlowController', ['$scope', 'entry', '$sanitize', '$log', function ($scope, entry, $sanitize, $log)
    {
        "use strict";

        $log.info ('[myApp] FlowController running');

        function enumerate_entries (entry, include_first)
        {
            var entries;
            if (include_first)
                entries = [entry];
            else
                entries = [];

            var current_entry = entry;

            while ((current_entry = current_entry.next ()))
            {
                // check if blocking condition applies
                if (current_entry.data.type === 'exercise'
                    || current_entry.data.type === 'continue-button')
                {
                    entries.push (current_entry);
                    $log.info ("blocking here");
                    return entries;
                }

                entries.push (current_entry);
            }

            return entries;
        }


        $scope.depth = entry.depth;
        $scope.entries = enumerate_entries (entry, true);

        $log.info ("Rendering " + $scope.entries.length + " entries.");

        function load_next_content (entry)
        {
            if (!entry)
                entry = $scope.entries[$scope.entries.length - 1];

            $scope.entries.push.apply ($scope.entries, enumerate_entries (entry));
        }

        $scope.continue_cb = function ()
        {
            var continue_button = $scope.entries.pop ();
            load_next_content (continue_button);
        };

        $scope.answered_cb = function (entry_id, answer)
        {
            //TODO: store (entry_id, answer) somewhere in the user context

            load_next_content();
        };

        $scope.sanitize = function (text)
        {
            return $sanitize (text);
        };

        $log.info ($scope.entries);
    }]);
