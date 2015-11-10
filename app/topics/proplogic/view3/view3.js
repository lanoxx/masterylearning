'use strict';

angular.module('myApp.view3', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('topics.proplogic.view3', {
      url: '/view3',
      templateUrl: 'topics/proplogic/view3/view3.html',
      controller: 'View3Ctrl'
  });
}])

.controller('View3Ctrl', ['$scope', '$state', function($scope, $state) {
      $scope.buttonMessage = "Check answer";

      $scope.checked = false;
      $scope.correct = false;

      $scope.check = function(solution) {
        if ($scope.checked && $scope.correct) {
          $state.go('topics.proplogic.view4');
          return;
        }

        if (solution == 2 ) {
          $scope.correct = true;
          $scope.buttonMessage = "Goto next question";
        }

        $scope.checked = true;
      }
}]);
