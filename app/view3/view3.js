'use strict';

angular.module('myApp.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])

.controller('View3Ctrl', ['$scope', '$location', function($scope, $location) {
      $scope.buttonMessage = "Check answer";

      $scope.checked = false;
      $scope.correct = false;

      $scope.check = function(solution) {
        if ($scope.checked && $scope.correct) {
          $location.path('/view4');
          return;
        }

        if (solution == 2 ) {
          $scope.correct = true;
          $scope.buttonMessage = "Goto next question";
        }

        $scope.checked = true;
      }
}]);
