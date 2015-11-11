'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'common.exercise',
    'myApp.profiles',
    'myApp.profiles.students',
    'myApp.profiles.teachers',
    'myApp.topics',
    'myApp.topics.proplogic',
    'myApp.topics.overview',
    'myApp.view1',
    'myApp.view2',
    'myApp.view3',
    'myApp.view4',
    'myApp.topics.firstorderlogic',
    'myApp.topics.firstorderlogic.exercise1',
    'myApp.topics.kripkestructures',
    'myApp.version'
]).
    config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'app.html'
        });
        $urlRouterProvider.otherwise('home');
    }]);
