'use strict';

angular.module('myApp.topics', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/topics', '/topics/overview');
        $stateProvider.state('topics', {
            url: '/topics',
            templateUrl: 'topics/topics.html',
            controller: 'TopicsCtrl'
        });
    }])

    .controller('TopicsCtrl', ['$state', function ($state) {

    }]);
