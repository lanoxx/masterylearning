'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$location', '$route', function($scope, $location, $route) {

      $scope.checked = false;
      $scope.correct = false;
      $scope.buttonMessage = "Check answer";

      function check(result) {
        if (result == "" || result == undefined) {
          return;
        }

        if ($scope.checked && $scope.correct) {
          $location.path("/view2");
          return;
        }

        if (result == "0") {
          $scope.correct = true;
          $scope.buttonMessage = "Goto next question";
        }
        $scope.checked = true;
      }

      $scope.check = check;
}]);
