angular.module ('myApp.student', ['ui.router', 'ngSanitize'])

    .config (['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('home.student.unit1', {
                url: '/unit1',
                templateUrl: 'student/practice/unit1.html',
                controller: 'Unit1Ctrl'
            })
            .state('home.student.unit1.content', {
                url: '/content',
                templateUrl: 'student/practice/content.html'
            })
            .state('home.student.unit1.exercises', {
                url: '/exercise/:id',
                templateUrl: 'student/practice/exercises.html',
                controller: 'ExerciseCtrl',
                resolve: {
                    exerciseData: function ()
                    {
                        return {
                            currentExercise: 1,
                            nextExercise: 2,
/*                            exercises: [
                                {
                                    title: 'Simple formula evaluation',
                                    text: '<div class="row" stlye="border: 1px solid grey">    <div class="col-md-6">        <div class="row">            <div class="col-md-9" mathmode>                <p>                    Given the following variable assignments:                </p>                <ul>                    <li>`a rarr 0`</li>                    <li>`b rarr 1`</li>                    <li>`c rarr 1`</li>                    <li>`d rarr 1`</li>                </ul>                <p>                    Please specify the result for the following logical formula:                </p>                <p>                    <span>`(a ^^ b) vv (c o+ D) = `<input type="text" name="result" ng-model="result" style="width: 40px;"></span>                </p>                <p ng-show="checked && correct">Answer is correct.</p>                <div ng-show="checked && !correct">                    <p>Sorry, the answer is wrong.</p>                    <p>Please evaluate the following questions separately:</p>                    <div class="row">                        <div class="col-md-offset-1 col-md-3">`(0 ^^ 1)`</div>                        <div class="col-md-2"><input type="text" style="width: 40px;"></div>                    </div>                    <div class="row">                        <div class="col-md-offset-1 col-md-3">`(1 ^^ 1)`</div>                        <div class="col-md-2"><input type="text" style="width: 40px;"></div>                    </div>                    <div class="row">                        <div class="col-md-offset-1 col-md-3">`(1 o+ 1)`</div>                        <div class="col-md-2"><input type="text" style="width: 40px;"></div>                    </div>                    <div class="row">                        <div class="col-md-offset-1 col-md-3">`(0 o+ 1)`</div>                        <div class="col-md-2"><input type="text" style="width: 40px;"></div>                    </div>                    <div class="row">                        <div class="col-md-offset-1 col-md-3">`(0 o+ 0)`</div>                        <div class="col-md-2"><input type="text" style="width: 40px;"></div>                    </div>                </div>            </div>            <div class="col-md-3">                <button class="btn btn-success" ng-click="check(result)">{{buttonMessage}}</button>                <br><br>                <button class="btn btn-primary" data-toggle="tooltip" data-placement="left" title="When using hints questions do not count as answered successfully.">View Hint</button>                <br><br>                <p>{{correct}}, {{checked}}</p>            </div>        </div>    </div>    <div class="col-md-6 bg-info">        <h1>Storyboard</h1>        <p><strong>Question type:</strong>Simple propositional formula</p>        <p>In this exercise we give the student a simple propositional formula to evaluate. When answered correctly,            we just go on to the next question. When a mistake is made, then we split-up the original formula into            its parts and let the user evaluate each part separately. This allows us to build up a statistical model            of operators that the student has problems with. As a result we will let the student practice this            operator more often in future questions.</p>        <p><strong>Note:</strong> Please answer this question wrong to see how we break it up into its parts.</p>        <p><strong>Note:</strong> To move on, one needs to answer the question correctly, there is no way to explicitly select an exercise, go back to </p>    </div></div>'}
                            ]*/
                            exercises: {
                                0: {
                                    id: 1,
                                    text: "Is $(P \\wedge Q)$ a subformula of the formula $(R \\vee (P \\wedge Q))$?",
                                    type: "yesno",
                                    answer: 1,
                                    correct: {id: "ex2", type: "exercise"},
                                    wrong: {id: "def3", type: "def"}
                                },
                                1: {
                                    id: 2,
                                    text: "Is $(Q \\wedge P)$ a subformula of the formula $(R \\vee (P \\wedge Q))$?",
                                    type: "yesno",
                                    answer: 0,
                                    correct: {id: "ex3", type: "exercise"},
                                    wrong: {id: "def3", type: "def"}
                                },
                                2: {
                                    id: 3,
                                    text: "Is $\\neg\\neg P$ a literal?",
                                    type: "yesno",
                                    answer: 0,
                                    correct: null,
                                    wrong: {id: "def2", type: "def"}
                                }
                            }
                        }
                    }
                }
            })
    }])

    .controller('Unit1Ctrl', ['$scope', '$uibModal', '$log', function ($scope, $uibModal, $log) {
        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'student/practice/unit1modal.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('[Unit1Ctrl] Modal dismissed at: ' + new Date());
            });
        };
    }])

    .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    /**
     * We make use of $sce from ngSanitize here, see:
     * https://docs.angularjs.org/api/ng/service/$sce#show-me-an-example-using-sce-
     */
    .controller('ExerciseCtrl', ['$scope', 'exerciseData', '$stateParams', '$sce', '$log', function ($scope, exerciseData, $stateParams, $sce, $log)
    {
        $scope.exerciseData = exerciseData;
        $scope.showoverview = $stateParams.id ? false : true;
        /*$scope.exercise = exerciseData.exercises[0];
        $scope.exercise.text = $sce.trustAsHtml($scope.exercise.text);*/

        $scope.yesNoOptions = [{label: 'Yes', id: 1}, {label: 'No', id: 0}];
        $scope.exercises = exerciseData.exercises;
        $scope.answered = [false, false, false];
        $scope.answer = undefined; // model for users answer;
        $scope.answered_cb = function (id)
        {
            if (this.answer.id === $scope.exercises[id].answer) {
                $log.debug('Exercise ' + id + ' answered correctly');
                $scope.answered[id] = true;
            } else {
                $log.debug('Exercise ' + id + ' answered wrong');
            }
        }
    }])

;
