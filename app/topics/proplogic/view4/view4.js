'use strict';

angular.module('myApp.view4', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('topics.proplogic.view4', {
      url: '/view4',
      templateUrl: 'topics/proplogic/view4/view4.html',
      controller: 'View4Ctrl'
  });
}])

.controller('View4Ctrl', ['$scope', '$state', function($scope, $state) {

        $scope.back = function () {
            $state.go('topics.proplogic.view1');
        }
}]);
