angular.module ('myapp.student.courses.entries.flow', ['ui.router', 'ngSanitize', 'myapp.student.courses.entries.exercises', 'myapp.services.content'])

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

    .controller ('FlowController', ['$scope', 'entry', 'ContentService', '$sanitize', '$log', function ($scope, entry, ContentService, $sanitize, $log)
    {
        "use strict";

        $log.info ('[myApp] FlowController running');

        var content = new ContentService (entry, block_on_exercise_or_continue, null);

        function block_on_exercise_or_continue (entry) {
            "use strict";
            var blocks;

            blocks = entry.data.type === 'exercise'
                || entry.data.type === 'continue-button';

            if (blocks)
                $log.info ("[myApp] FlowController: enumeration was blocked by entry type: " + entry.data.type);

            return blocks;
        }

        $scope.depth = entry.depth;
        $scope.entries = content.enumerate_tree();

        $log.info ("[myApp] FlowController: Rendering " + $scope.entries.length + " entries.");

        function load_next_content ()
        {
            $scope.entries.push.apply ($scope.entries, content.enumerate_tree());
        }

        $scope.continue_cb = function ()
        {
            $scope.entries.pop ();
            load_next_content ();
        };

        $scope.answered_cb = function (entry, answer_model, answer)
        {
            //TODO: store (entry.id, answer) somewhere in the user context

            var next;
            if (answer)
                // get the correct entry of the exercise
                next = entry.data.correct;
            else
                next = entry.data.incorrect;

            if (next)
                content.push (next);

            load_next_content();
        };

        $scope.sanitize = function (text)
        {
            return $sanitize (text);
        };
    }]);
