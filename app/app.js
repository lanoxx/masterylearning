'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'ui.bootstrap',
    'common.exercise',
    'common.mathmode',
    'myApp.profiles',
    'myApp.profiles.students',
    'myApp.profiles.teachers',
    'myApp.practice',
    'myApp.topics',
    'myApp.topics.proplogic',
    'myApp.lectures2',
    'myApp.lectures2.propositionallogic',
    'myApp.content',
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
        MathJax.Hub.Config({
            asciimath2jax: {
                delimiters: [['`', '`'], ['$', '$']]
            }
        });

        $stateProvider.state('home', {
            url: '/home',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html'
                },
                '@': {
                    templateUrl: 'app.html'
                }
            }
        });
        $urlRouterProvider.otherwise('home');
    }])


    .directive ('lecture-menu', function () {
        return {
            restrict: 'E',
            templateUrl: 'app-lecturemenu.html',
            transclude: true,
            controller: 'LectureMenuCtrl'
        }
    })

    .controller ('LectureMenuCtrl', ['$scope', '$templateCache', function ($scope, $templateCache) {
    }]);
