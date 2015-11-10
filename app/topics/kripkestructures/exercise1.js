'use strict';

angular.module('myApp.topics.kripkestructures', ['ui.router'])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('topics.kripkestructures', {
            url: '/kripkestructures',
            templateUrl: 'topics/kripkestructures/exercise1.html',
            controller: 'KripkeStructuresCtrl'
        });
    }])

    .controller('KripkeStructuresCtrl', ['$scope', '$state', function($scope, $state) {

    }]);
