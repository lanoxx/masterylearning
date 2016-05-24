angular.module ('myapp.student.courses.entries.exercises')

    /**
     * The Exercise directive exports three properties:
     *
     * @exercise: The exercise object used to render the exercise. It must have the following properties
     *            { title:String, text:String, answer:boolean }
     * @onanswered: A callback to be called by the directive when the user has selected an answer.
     */
    .directive ('myAppMultiAnswerExercise', ['$log', '$sanitize', 'HistoryService', function ($log, $sanitize, HistoryService)
    {
        function MultiAnswerExerciseController ($scope)
        {
            /**
             * Stores for each answer_candidate if the given answer matches the answer key
             * @type {Array}
             */
            var results = [];

            /**
             * Stores for each answer_candidate which answer the user has given
             * @type {Array}
             */
            $scope.answers = [];

            /**
             * True if the user has asked to check his answer or if a previously
             * answered state was loaded
             * @type {boolean}
             */
            $scope.answered = false;

            /**
             * If the user has answered all answer_candidates correctly.
             * @type {boolean}
             */
            var correct = true;

            $scope.sanitize = sanitize;
            $scope.answer_changed_cb = answer_changed_cb;
            $scope.is_answer_correct = is_answer_correct;
            $scope.is_answer_wrong = is_answer_wrong;
            $scope.check_cb = check_cb;

            init();

            function init () {
                "use strict";

                // Always initialize the answers array to false
                $scope.exercise.answerCandidates.forEach(function (candidate, index)
                {
                    $scope.answers[index] = false;
                });

                // Then check if there is a state and use it to initialize
                // the exericse.
                if (!$scope.exercise.state) {
                    return;
                }

                var resultTokens = $scope.exercise.state.split (";");

                if (resultTokens.length > 0)
                    resultTokens.splice (0,1);

                resultTokens.forEach (function (token, index)
                {
                    if (token === "false") {
                        $scope.answers[index] = false;
                    } else if (token === "true") {
                        $scope.answers[index] = true;
                    } else {
                        $log.error ("[myApp] myMultiAnswerExercise: unknown state entry encountered. Ignoring: " + token);
                    }
                });

                $scope.answer_changed_cb ();
                check_answer ();
            }

            function sanitize (text)
            {
                return $sanitize (text);
            }

            function answer_changed_cb ()
            {
                // this callback is for answers to single answer candidates, but we always recompute
                // the results for all candidate to ensure that we generate results also for those
                // candidate which the user never answered, to ensure that the results contain
                // valid values (true/false) instead of undefined.

                $scope.exercise.answerCandidates.forEach(function (candidate, index)
                {
                    var usersAnswer = $scope.answers[index] || false;
                    results[index] = usersAnswer === candidate.correct;
                });
            }

            function is_answer_correct (index)
            {
                return $scope.answered && results[index];
            }

            function is_answer_wrong (index)
            {
                return $scope.answered && !results[index];
            }

            function check_answer ()
            {
                $scope.answered = true;

                results.forEach (function (result)
                {
                    correct = correct && result;
                });
            }

            function check_cb ()
            {
                // Check the users answers
                check_answer ();

                // Compute state string
                var resultString = correct;
                $scope.answers.forEach(function (answer)
                {
                    resultString += ";" + answer;
                });

                // Persist state
                HistoryService.setEntryState().save (
                    { courseId: $scope.exercise.courseId, entryId: $scope.exercise.id },
                    { state: resultString }
                );

                // Inform users of this directive
                $scope.onanswered ({answer_model: results, answer: correct});
            }
        }

        return {
            scope: {
                exercise: '=exercise',
                onanswered: '&onanswered'
            },
            controller: ['$scope', MultiAnswerExerciseController],
            templateUrl: 'student/courses/entries/exercises/my-app-multianswerexercise.tpl.html'
        };
    }]);
