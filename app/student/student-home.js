angular.module ('myApp.student', ['ui.router'])

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
            .state('home.student.unit1.exercise1', {
                url: '/exercise/:id',
                templateUrl: 'student/practice/exercises/view1.html',
                controller: 'ExerciseCtrl',
                resolve: {
                    exerciseData: function ()
                    {
                        return {
                            currentExercise: 1,
                            nextExercise: 2
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
    .controller('ExerciseCtrl', ['$scope', 'exerciseData', function ($scope, exerciseData)
    {
        $scope.exerciseData = exerciseData;
    }])

;
