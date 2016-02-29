angular.module ('myapp.student.courses.entries.exercises')

    /**
     * The Exercise directive exports three properties:
     *
     * @exercise: The exercise object used to render the exercise. It must have the following properties
     *            { title:String, text:String, answer:boolean }
     * @onanswered: A callback to be called by the directive when the user has selected an answer.
     */
    .directive ('myAppYesNoExercise', ['$log', '$sanitize', function ($log, $sanitize)
    {
        return {
            scope: {
                exercise: '=exercise',
                onanswered: '&onanswered'
            },
            controller: ['$scope', function ($scope)
            {
                $scope.correct = false;
                $scope.answer = null;
                $scope.answered = false;

                $scope.sanitize = function (text)
                {
                    return $sanitize (text);
                };

                $scope.answered_cb = function ()
                {
                    $scope.answered = true;
                    $scope.onanswered ({answer_model: $scope.answer, answer: $scope.correct});
                };

                $scope.is_answer_correct = function ()
                {
                    return $scope.answered && $scope.answer === $scope.exercise.answer;
                };

                $scope.is_answer_wrong = function ()
                {
                    return $scope.answered && $scope.answer !== $scope.exercise.answer;
                };

                $scope.showAlertClass = function (success)
                {
                    var result = $scope.answer === $scope.exercise.answer;

                    if (success)
                        return $scope.answered && result;
                    else
                        return $scope.answered && !result;
                };

                $scope.check_answer = function ()
                {
                    $scope.answered = true;
                    for (var i = 0, n = $scope.exercise.answer_candidates.length; i < n; i++) {
                        $scope.results[i] = $scope.results[i] || false;
                    }
                    $scope.onanswered ({answer: $scope.results});
                }
            }],
            templateUrl: 'student/courses/entries/exercises/my-app-yesnoexercise.tpl.html'
        };
    }]);
