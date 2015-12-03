'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'ui.bootstrap',
    'common.exercise',
    'common.mathmode',
    'myApp.services.roles',
    'myApp.profiles.students',
    'myApp.profiles.teachers',
    'myApp.practice',
    'myApp.topics',
    'myApp.topics.proplogic',
    'myApp.lectures2',
    'myApp.lectures2.propositionallogic',
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

        /**
         * Currently this is the home, but at some point we need to rename it to 'welcome' or 'login'.
         * For simplicity we have no user management now so we just leave it like this.
         */
        $stateProvider.state('home', {
            url: '/home',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationCtrl'
                },
                '@': {
                    templateUrl: 'app.html'
                }
            }
        })

            .state('student', {
                url: '/student',
                views: {
                    'navigation@': {
                        templateUrl: 'navigation.html',
                        controller: 'NavigationCtrl'
                    },
                    '@': {
                        templateUrl: 'student-home.html'
                    }
                }
            })

            .state('teacher', {
                url: '/teacher',
                views: {
                    'navigation@': {
                        templateUrl: 'navigation.html',
                        controller: 'NavigationCtrl'
                    },
                    '@': {
                        templateUrl: 'teacher-home.html'
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

    }])

    .controller ('NavigationCtrl', ['$scope', '$state', 'RoleService', function ($scope, $state, RoleService) {
        $scope.roleService = RoleService;

        /**
         * This will attempt to set the new role in the role service and if successful switches the route
         * according to the new role.
         *
         * @param role A valid role from the RoleService
         */
        $scope.switch_role = function (role) {
            if (RoleService.setRole(role)) {
                if (role == RoleService.STUDENT)
                    $state.go('student');
                if (role == RoleService.TEACHER)
                    $state.go('teacher');
                if (role == RoleService.NONE)
                    $state.go('home');
            }
        }
    }]);
