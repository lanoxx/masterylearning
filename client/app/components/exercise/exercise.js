/**
 * Use like this:
 *
 *     <exercise answerbutton="true" hintbutton="true"></exercise>
 *
 */
angular.module ('common.exercise', [])
.directive('exercise', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/exercise/exercise.html',
            scope: {
                answerbutton: "=",
                hintbutton: "="
            },

            //TODO: we need a generic way to inject a function that checks the answer for correctness
            //TODO: we need a way to properly inject structured content into the exercise, like the question and
            //      answer but also hints and subquestions if we need to split up the question
            controller: ['$scope', function ($scope) {
                $scope.buttonMessage = "Check answer";
                $scope.checked = false;
                $scope.correct = false;
                $scope.check = function (model) {
                    $scope.checked = true;
                }
            }]
        }
    });
