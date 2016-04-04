angular.module ('myapp.student.courses.entries.exercises', ['ui.router', 'ngSanitize', 'myapp.services.content'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries.exercises', {
            url: '/exercises',
            resolve: {
                exercises: ['$stateParams', 'course_id', 'entry_id', 'entry', 'database', '$log', function ($stateParams, course_id, entry_id, entry, database, $log)
                {
                    var entries = [];
                    if (entry.data.type === 'unit' || entry.data.type === 'section') {
                        entries = entry.children;
                    }

                    return entries.filter(function (entry)
                    {
                        return entry.data.type === 'exercise';
                    });
                }],

                entry: ['$stateParams', 'course_id', 'entry_id', 'entry', 'database', '$log', function ($stateParams, course_id, entry_id, entry, database, $log)
                {
                    return entry;
                }]
            },
            templateUrl: 'student/courses/entries/exercises/exercises.html',
            controller: 'ExerciseController'
        });
    }])

    .controller ('ExerciseController', ['$scope', '$sanitize', 'ContentService', 'exercises', 'entry', '$log', function ($scope, $sanitize, ContentService, exercises, entry, $log)
    {
        var content = new ContentService (entry, block_on_exercise, filter_exercises);

        $scope.entries = [];

        function block_on_exercise (entry)
        {
            return entry.data.type === 'exercise';
        }

        function filter_exercises (entry)
        {
            return entry.data.type === 'exercise';
        }

        var load_next_exercise = function ()
        {
             $scope.entries.push.apply ($scope.entries, content.enumerate_subtree ());
        };

        $log.info ("[myApp] ExerciseController: Loaded " + exercises.length + " exercises");

        $scope.answered_cb = function (entry, answer_model, answer)
        {
            $log.info ("[myApp] ExerciseController: Answered exercise " + entry.id + ", answer=" + answer);

            if (answer)
                next = entry.data.correct;
            else
                next = entry.data.incorrect;

            if (next) {
                content.push (next);
                content.set_exercise_tree ();
            }

            load_next_exercise ();
        };

        $scope.sanitize = function (text)
        {
            return $sanitize (text);
        };

        load_next_exercise();
    }]);
