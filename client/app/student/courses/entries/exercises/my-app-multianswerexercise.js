angular.module ('myapp.student.courses.entries.exercises')

    /**
     * The Exercise directive exports three properties:
     *
     * @exercise: The exercise object used to render the exercise. It must have the following properties
     *            { title:String, text:String, answer:boolean }
     * @onanswered: A callback to be called by the directive when the user has selected an answer.
     */
    .directive ('myAppMultiAnswerExercise', ['$log', '$sanitize', function ($log, $sanitize)
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
             * True if the user has asked to check his answer.
             * @type {boolean}
             */
            $scope.answered = false;

            /**
             * If the user has answered all answer_candidates correctly.
             * @type {boolean}
             */
            var correct = true;

            $scope.sanitize = function (text)
            {
                return $sanitize (text);
            };

            $scope.check_cb = function (index)
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
            };

            $scope.is_answer_correct = function (index)
            {
                return $scope.answered && results[index];
            };

            $scope.is_answer_wrong = function (index)
            {
                return $scope.answered && !results[index];
            };

            $scope.check_answer = function ()
            {
                $scope.answered = true;

                results.forEach(function (result)
                {
                    correct = correct && result;
                });
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
