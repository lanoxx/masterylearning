angular.module ('myapp.student.courses.entries.exercises')

    /**
     * The Exercise directive exports three properties:
     *
     * @exercise: The exercise object used to render the exercise. It must have the following properties
     *            { title:String, text:String, answer:boolean }
     * @onanswered: A callback to be called by the directive when the user has selected an answer.
     */
    .directive ('myAppYesNoExercise', ['$log', '$sanitize', 'HistoryService', function ($log, $sanitize, HistoryService)
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

                $scope.sanitize = sanitize;
                $scope.check_cb = check_cb;
                $scope.is_answer_correct = is_answer_correct;
                $scope.is_answer_wrong = is_answer_wrong;

                init();

                function init ()
                {
                    if (!$scope.exercise.state) {
                        return;
                    }

                    var stateTokens = $scope.exercise.state.split (";");

                    $scope.answer = stateTokens[1] !== "false";

                    check_answer();
                }

                function is_answer_correct ()
                {
                    return $scope.answered && $scope.answer === $scope.exercise.answer;
                }

                function is_answer_wrong ()
                {
                    return $scope.answered && $scope.answer !== $scope.exercise.answer;
                }

                function check_answer () {
                    "use strict";

                    $scope.answered = true;

                    $scope.correct = $scope.answer === $scope.exercise.answer;
                }

                function check_cb ()
                {
                    check_answer();

                    HistoryService.setEntryState().save ({ courseId: $scope.exercise.courseId, entryId: $scope.exercise.id }, { state: $scope.correct + ";" + $scope.answer + "" });

                    $scope.onanswered ({answer_model: $scope.answer, answer: $scope.correct});
                }

                function sanitize (text)
                {
                    return $sanitize (text);
                }
            }],
            templateUrl: 'student/courses/entries/exercises/my-app-yesnoexercise.tpl.html'
        };
    }]);
