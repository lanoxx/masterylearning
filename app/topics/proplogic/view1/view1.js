'use strict';

angular.module('myApp.view1', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('topics.proplogic.view1', {
    url: '/view1',
    templateUrl: 'topics/proplogic/view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$state', function($scope, $state) {

      $scope.checked = false;
      $scope.correct = false;
      $scope.buttonMessage = "Check answer";

      function check(result) {
          console.log("Clicked");
        if (result == "" || result == undefined) {
            console.log("NOTHING");
          return;
        }

        if ($scope.checked && $scope.correct) {
          $state.go("topics.proplogic.view2");
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
