angular.module('myapp.student.courses.entries', ['ui.router'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries', {
            url: '/entries/:entry_id',
            resolve: {
                entry: ['$stateParams', 'database', '$log', function ($stateParams, database, $log)
                {
                    var db_entries = database.get_entries();

                    return db_entries[$stateParams.entry_id];
                }],
                entry_id: ['$stateParams', function ($stateParams)
                {
                    return $stateParams.entry_id;
                }]
            },
            templateUrl: 'student/courses/entries/entries.html',
            controller: 'EntriesCtrl',
            role: 'ROLE_STUDENT'
        });

        $stateProvider.state ('home.student.courses.entries.structure', {
            url: '/structure',
            resolve: {
                entry: ['$stateParams', 'course_id', 'entry_id', 'database', '$log', function ($stateParams, course_id, entry_id, database, $log)
                {
                    var db_entries = database.get_entries();

                    return db_entries[entry_id];
                }]
            },
            templateUrl: 'student/courses/entries/structure/structure.html',
            controller: 'StructureController'
        });

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
                        return entry.type === 'yesnoexercise';
                    });
                }]
            },
            templateUrl: 'student/courses/entries/exercises/exercises.html',
            controller: 'ExerciseController'
        });
    }])

    .controller ('EntriesCtrl', ['$scope', 'entry', '$log', function ($scope, entry, $log)
    {
        $log.info ('[myApp] EntriesCtrl running');
        if (entry.type == 'unit')
            $scope.unit = entry;
        else
            $scope.entry = entry;
    }])

    .controller ('StructureController', ['$scope', 'entry', '$log', function ($scope, entry, $log)
    {
        $log.info ('[myApp] StructureController running');
        if (entry.type == 'unit')
            $scope.unit = entry;
        else
            $scope.entry = entry;
    }])
    .controller ('ExerciseController', ['$scope', 'exercises', '$log', function ($scope, exercises, $log)
    {
        $scope.exercises = exercises;
        $scope.result = [{value: null}, {value: null}];


        $scope.answered_cb = function (index, answer)
        {
            $log.info("Answered exercise " + index + " result[" + index + "]=" + $scope.result[index].value + ", answer=" + answer);
        };
    }])

    /**
     * The Exercise directive exports three properties:
     *
     * @exercise: The exercise object used to render the exercise. It must have the following properties
     *            { title:String, text:String, answer:boolean }
     * @answer: An location to write the result of the answered exercise to. This must be an object with a value
     *          property: { value }. The initial value of the value property should be null.
     * @onanswered: A callback to be called by the directive when the user has selected an answer.
     */
    .directive ('myAppExercise', ['$log', function ($log)
    {
        return {
            scope: {
                /* The '=' binding type is bi-directional, but in order to write the value back to the outside scope,
                 * an object value must be bound to the property and not a primitive value. */
                exercise: '=exercise',
                answer: '=answer',
                onanswered: '&onanswered'
            },
            link: function (scope, element, attrs)
            {
                if ('myAppType' in attrs)
                {
                    $log.info("Current answer: " + scope.answer);
                    $log.info("got it");
                }

                if (scope.answer.value !== null) {
                    $log.error ("The '.value' property of the object bound to 'answer' must be initialized to null");
                }
            },
            controller: ['$scope', function ($scope)
            {
                $log.info ($scope);
                $scope.answered_cb = function ()
                {
                    $scope.onanswered({answer: $scope.answer.value});
                };

                $scope.showAlertClass = function (name)
                {
                    switch (name) {
                        case 'alert-success':
                            return $scope.answer.value === $scope.exercise.answer;
                        case 'alert-danger':
                            return $scope.answer.value !== null && $scope.answer.value !== $scope.exercise.answer;
                    }
                }
            }],
            templateUrl: 'student/courses/entries/exercises/myAppExercise.tpl.html'
        };
    }]);
