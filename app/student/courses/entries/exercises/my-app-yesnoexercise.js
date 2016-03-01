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

                $scope.check_cb = function ()
                {
                    $scope.answered = true;

                    $scope.correct = $scope.answer === $scope.exercise.answer;

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
            }],
            templateUrl: 'student/courses/entries/exercises/my-app-yesnoexercise.tpl.html'
        };
    }]);
