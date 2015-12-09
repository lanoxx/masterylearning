'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'ui.bootstrap',
    'ngCookies',
    'common.exercise',
    'common.mathmode',
    'myApp.services.roles',
    'myApp.services.sidebar',
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
])

    .service ('UserService', [function () {
        this.currentUser = null;
        this.role = "ROLE_GUEST";
    }])

    .run (['$rootScope', '$state', '$cookies', 'UserService', 'RoleService', function ($rootScope, $state, $cookies, UserService, RoleService) {

        var role = $cookies.get('role');
        var currentUser = $cookies.get('currentUser');

        if (role) {
            if (role === 'ROLE_STUDENT') {
                console.log ('[myApp].run: Switching application role to RoleService.STUDENT and security-role to ROLE_STUDENT');
                RoleService.currentRole = RoleService.STUDENT;
            }

            if (role === 'ROLE_TEACHER') {
                console.log ('[myApp].run: Switching application role to RoleService.TEACHER and security-role to ROLE_TEACHER');
                RoleService.currentRole = RoleService.TEACHER;
            }

            UserService.role = role;
        }

        if (currentUser) {
            UserService.currentUser = currentUser;
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            console.log ("$stateChangeStart (destination state: " + toState.name + "; requires role: '" + toState.role + "'");
            if (toState.role === 'ROLE_GUEST') {
                // no need to check anything. We can always transition to an unsecured state.
            } else if (toState.role === 'ROLE_STUDENT' || toState.role === 'ROLE_TEACHER') {
                // we need to check that the user is authenticated and has the right role.
                if (!(UserService.role === 'ROLE_STUDENT' || UserService.role === 'ROLE_TEACHER')) {
                    event.preventDefault();
                }
            }
        });
    }])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
                    templateUrl: 'app.html',
                    controller: 'HomeCtrl'
                }
            },
            role: 'ROLE_GUEST'
        })

            .state('home.student', {
                url: '/student',
                views: {
                    'navigation@': {
                        templateUrl: 'navigation.html',
                        controller: 'NavigationCtrl'
                    },
                    '@': {
                        templateUrl: 'student-home.html',
                        controller: 'StudentCtrl'
                    }
                },
                role: 'ROLE_STUDENT'
            })

            .state('home.teacher', {
                url: '/teacher',
                views: {
                    'navigation@': {
                        templateUrl: 'navigation.html',
                        controller: 'NavigationCtrl'
                    },
                    '@': {
                        templateUrl: 'teacher-home.html',
                        controller: 'TeacherCtrl'
                    }
                },
                role: 'ROLE_TEACHER'
            });

        $urlRouterProvider.otherwise('home');
    }])

    .controller ('HomeCtrl', ['$rootScope', function ($rootScope) {
    }])

    .controller ('StudentCtrl', ['$rootScope', function ($rootScope) {
    }])

    .controller ('TeacherCtrl', ['$rootScope', function ($rootScope) {
    }])

    .controller ('NavigationCtrl', ['$scope', '$state', '$cookies', 'RoleService', 'UserService', 'SidebarService',
        function ($scope, $state, $cookies, RoleService, UserService, SidebarService)
    {
        $scope.roleService = RoleService;
        $scope.toggleSidebar = function () {
            SidebarService.collapsed = !SidebarService.collapsed;
            console.log ('Sidebar:' + SidebarService.collapsed);
        };

        /**
         * This will attempt to set the new role in the role service and if successful switches the route
         * according to the new role.
         *
         * @param role A valid role from the RoleService
         */
        $scope.switch_role = function (role) {
            if (RoleService.setRole(role)) {
                if (role == RoleService.STUDENT) {
                    UserService.role = 'ROLE_STUDENT';
                    UserService.currentUser = 'maxmusterman';
                    $cookies.put('role', 'ROLE_STUDENT');
                    $cookies.put('currentUser', 'maxmusterman');
                    $state.go('home.student');
                }
                if (role == RoleService.TEACHER) {
                    UserService.role = 'ROLE_TEACHER';
                    UserService.currentUser = 'maxmusterman';
                    $cookies.put('role', 'ROLE_TEACHER');
                    $cookies.put('currentUser', 'maxmusterman');
                    $state.go('home.teacher');
                }
                if (role == RoleService.NONE) {
                    console.log ('[myApp].NavigationController: Logging out. Switching security role to ROLE_GUEST');
                    UserService.role = 'ROLE_GUEST';
                    UserService.currentUser = null;
                    $cookies.remove('role');
                    $cookies.remove('currentUser');
                    $state.go('home');
                }
            }
        }
    }]);
