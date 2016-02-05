'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'ui.bootstrap',
    'ngCookies',
    'katex',
    'common.exercise',
    'myApp.services.roles',
    'myApp.student',
    'myApp.student.courses',
    'myapp.student.courses.entries',
    'myApp.student.profile',
    'myapp.teacher',
    'myApp.teacher.profile',
    'myApp.topics',
    'myApp.topics.proplogic',
    'myApp.view1',
    'myApp.view2',
    'myApp.view3',
    'myApp.view4',
    'myApp.topics.firstorderlogic',
    'myApp.topics.firstorderlogic.exercise1',
    'myApp.version'
])

    .service ('UserService', [function () {
        this.currentUser = null;
        this.role = "ROLE_GUEST";
    }])

    .run (['$rootScope', '$state', '$cookies', 'UserService', 'RoleService', '$log',
        function ($rootScope, $state, $cookies, UserService, RoleService, $log) {
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
            if (toState.role === undefined) {
                // if no role is defined, then the route does not need to be secured and we can just continue to change
                // to it
                $log.info("[myApp] $stateChangeStart (route change accepted)");
                return;
            }
            console.log ("[myApp] $stateChangeStart (destination state: " + toState.name + "; requires role: '" + toState.role + "'");
            if (toState.role === 'ROLE_GUEST') {
                // no need to check anything. We can always transition to an unsecured state.
            } else if (toState.role === 'ROLE_STUDENT' || toState.role === 'ROLE_TEACHER') {
                // we need to check that the user is authenticated and has the right role.
                if (!(UserService.role === 'ROLE_STUDENT' || UserService.role === 'ROLE_TEACHER')) {
                    event.preventDefault();
                    $log.info ("[myApp] $stateChangeStart (route change rejected)");
                    return;
                }
            }
            $log.info("[myApp] $stateChangeStart (route change accepted)");
        });

        $rootScope.$on ('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $log.info ("[myApp] $stateChangeError (toState: " + toState.name + ") with error: " + error);
        });
        $rootScope.$on ('$stateNotFound', function (event, toState, toParams, fromState, fromParams) {
            $log.info ("[myApp] $stateNotFound (state: " + toState.name + ")");
        });
    }])

    .config(['$stateProvider', '$urlRouterProvider', 'katexConfigProvider', '$logProvider', function ($stateProvider, $urlRouterProvider, katexConfigProvider, $logProvider) {
        var $log =  angular.injector(['ng']).get('$log');
        katexConfigProvider.errorHandler = function (error, expression, element)
        {
            $log.info(error);
        };

        $urlRouterProvider.when ('/home/student/unit1', '/home/student/unit1/content');

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
                        templateUrl: 'student/student-home.html',
                        controller: 'StudentCtrl'
                    }
                },
                role: 'ROLE_STUDENT'
            })

            .state ('home.student.practice', {
                url: '/practice',
                templateUrl: 'student/practice/unit1.html'
            });

        $urlRouterProvider.otherwise('home');
    }])

    .controller ('HomeCtrl', ['$rootScope', function ($rootScope) {
    }])

    .controller ('StudentCtrl', ['$rootScope', function ($rootScope) {
    }])

    .controller ('NavigationCtrl', ['$scope', '$state', '$cookies', 'RoleService', 'UserService',
        function ($scope, $state, $cookies, RoleService, UserService)
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
