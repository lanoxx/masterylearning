'use strict';

angular.module('myApp.topics.firstorderlogic.exercise1', ['ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('topics.firstorderlogic.exercise1', {
            url: '/firstorderlogic/exercise1',
            templateUrl: 'topics/firstorderlogic/exercise1/exercise1.html',
            controller: 'Exercise1Ctrl'
        });
    }])
    .controller ('Exercise1Ctrl', ['$scope', '$state', function ($scope, $state) {
        $scope.buttonMessage = "Check answer";
        $scope.checked = false;
        $scope.correct = false;
        $scope.check = function (model) {
            if ($scope.checked && $scope.correct) {
                $state.go ('topics.firstorderlogic.exercise2');
                return;
            }

            if (model.check1 && model.check2 && model.check3) {
                $scope.correct = true;
                $scope.buttonMessage = "Goto next question";
            }

            $scope.checked = true;
        };
    }])
