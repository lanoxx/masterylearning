angular.module ('myapp.student.courses.entries.exercises', ['ui.router'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries.exercises', {
            url: '/exercises',
            resolve: {
                exercises: ['$stateParams', 'course_id', 'entry_id', 'entry', 'database', '$log', function ($stateParams, course_id, entry_id, entry, database, $log)
                {
                    var entries = [];
                    if (entry.type === 'unit' || entry.type === 'section') {
                        entries = entry.entries;
                    }

                    return entries.filter(function (entry)
                    {
                        return entry.type === 'yesnoexercise' || entry.type === 'multianswerexercise';
                    });
                }]
            },
            templateUrl: 'student/courses/entries/exercises/exercises.html',
            controller: 'ExerciseController'
        });
    }])

    .controller ('ExerciseController', ['$scope', 'exercises', '$log', function ($scope, exercises, $log)
    {
        $scope.exercises = exercises;
        $log.info ("[myApp] ExerciseController: Loaded " + exercises.length + " exercises");

        $scope.answered_cb = function (index, answer)
        {
            $log.info ("Answered exercise " + index + ", answer=" + answer);

            //TODO: when a multi answer is answered, I still need to connect the result[index].value with the answer object
            //      since we are getting an array and not a single boolean value we also need to handle this different
            //      from the yesnoanswers.
        };
    }])

    /**
     * The Exercise directive exports three properties:
     *
     * @exercise: The exercise object used to render the exercise. It must have the following properties
     *            { title:String, text:String, answer:boolean }
     * @onanswered: A callback to be called by the directive when the user has selected an answer.
     */
    .directive ('myAppExercise', ['$log', function ($log)
    {
        return {
            scope: {
                exercise: '=exercise',
                onanswered: '&onanswered'
            },
            controller: ['$scope', function ($scope)
            {
                var get_type = function (type)
                {
                    switch (type)
                    {
                        case "yesnoexercise":
                            return "dropdown";
                        case "multianswerexercise":
                            return "checkboxes";
                        default:
                            throw Error ("Exercise type is not implemented");
                    }
                };

                $scope.type = get_type ($scope.exercise.type);
                $scope.results = [];
                $scope.answered = false;

                $scope.answered_cb = function ()
                {
                    $scope.answered = true;
                    $scope.onanswered ({answer: $scope.results[0]});
                };

                $scope.showAlertClass = function (name)
                {
                    var result = true;

                    if ($scope.type === 'dropdown')
                        result = $scope.results[0] !== undefined && $scope.results[0] === $scope.exercise.answer;
                    else if ($scope.type === 'checkboxes')
                    {
                        $scope.exercise.answer_candidates.forEach (function (candidate, i)
                        {
                            result = result && $scope.results[i] === candidate.key;
                        });
                    }

                    switch (name) {
                        case 'alert-success':
                        {
                            return $scope.answered && result;
                        }
                        case 'alert-danger':
                        {
                            return $scope.answered && !result;
                        }
                    }
                };

                $scope.check_answer = function ()
                {
                    $scope.answered = true;
                    for (var i = 0, n = $scope.exercise.answer_candidates.length; i < n; i++)
                    {
                        $scope.results[i] = $scope.results[i] || false;
                    }
                    $scope.onanswered ({answer: $scope.results});
                }
            }],
            templateUrl: 'student/courses/entries/exercises/myAppExercise.tpl.html'
        };
    }]);
