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

        function block_on_exercise_or_continue (entry) {
            "use strict";
            var blocks;

            blocks = entry.data.type === 'exercise'
                || entry.data.type === 'continue-button';

            if (blocks)
                $log.info ("[myApp] FlowController: enumeration was blocked by entry type: " + entry.data.type);

            return blocks;
        }

        function enumerate_entries (entry, blocks, include_first)
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
                if (blocks (current_entry))
                {
                    entries.push (current_entry);

                    return entries;
                }

                entries.push (current_entry);
            }

            return entries;
        }

        $scope.depth = entry.depth;
        $scope.entries = enumerate_entries (entry, block_on_exercise_or_continue, true);

        $log.info ("[myApp] FlowController: Rendering " + $scope.entries.length + " entries.");

        function load_next_content (entry, include_first)
        {
            if (!entry)
                entry = $scope.entries[$scope.entries.length - 1];

            $scope.entries.push.apply ($scope.entries, enumerate_entries (entry, block_on_exercise_or_continue, include_first));
        }

        $scope.continue_cb = function ()
        {
            var continue_button = $scope.entries.pop ();
            load_next_content (continue_button);
        };

        $scope.answered_cb = function (entry, answer_model, answer)
        {
            //TODO: store (entry.id, answer) somewhere in the user context

            var next;
            if (answer)
                // get the correct entry of the exercise
                next = entry.data.correct || entry;
            else
                next = entry.data.incorrect || entry;

            if (next !== entry)
                load_next_content(next, true);
            else
                load_next_content(next);
        };

        $scope.sanitize = function (text)
        {
            return $sanitize (text);
        };
    }]);
