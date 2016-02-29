angular.module ('myapp.student.courses.entries.exercises', ['ui.router', 'ngSanitize'])

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
                }]
            },
            templateUrl: 'student/courses/entries/exercises/exercises.html',
            controller: 'ExerciseController'
        });
    }])

    .controller ('ExerciseController', ['$scope', 'exercises', '$log', function ($scope, exercises, $log)
    {
        var exercise_count = 0;

        var load_next_exercise = function ()
        {
            exercise_count++;
            $scope.exercises = exercises.slice(0, exercise_count);
        };

        $log.info ("[myApp] ExerciseController: Loaded " + exercises.length + " exercises");


        $scope.answered_cb = function (index, answer)
        {
            $log.info ("Answered exercise " + index + ", answer=" + answer);

            load_next_exercise ();

            //TODO: when a multi answer is answered, I still need to connect the result[index].value with the answer
            // object since we are getting an array and not a single boolean value we also need to handle this
            // different from the yesnoanswers.
        };

        load_next_exercise();
    }]);
