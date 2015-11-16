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

    .controller('TopicsCtrl', ['$state', '$rootScope', function ($state, $rootScope) {
        $rootScope.$on ('$viewContentLoaded', function (event) {
            //TODO: can we use this event to somehow render the math content in the template with MathJax?
            console.log(event);
        });
    }]);
