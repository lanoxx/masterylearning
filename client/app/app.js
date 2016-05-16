'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'ui.bootstrap',
    'ngCookies',
    'katex',
    'myapp.services.roles',
    'myapp.services.user',
    'myapp.services.history',
    'myapp.services.http',
    'myApp.student',
    'myApp.student.courses',
    'myapp.student.courses.entries',
    'myapp.student.courses.entries.exercises',
    'myapp.student.courses.entries.flow',
    'myApp.student.profile',
    'myapp.teacher',
    'myApp.teacher.profile',
    'myapp.user',
    'myApp.version'
])

    .config(['$stateProvider', '$urlRouterProvider', 'katexConfigProvider', '$httpProvider', 'RoleProvider', function ($stateProvider, $urlRouterProvider, katexConfigProvider, $httpProvider, RoleProvider) {
        var $log =  angular.injector(['ng'], true).get('$log');

        $httpProvider.interceptors.push ('ResponseInterceptor');

        katexConfigProvider.errorHandler = function (error, expression, element)
        {
            $log.info(error);
        };

        katexConfigProvider.defaultOptions = {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "\\[", right: "\\]", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false}
            ]
        };

        /**
         * Currently this is the home, but at some point we need to rename it to 'welcome' or 'login'.
         * For simplicity we have no user management now so we just leave it like this.
         */
        $stateProvider.state('home', {
            url: '/home',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationController'
                },
                '@': {
                    templateUrl: 'app.html',
                    controller: 'HomeCtrl'
                },
                'footer@': {
                    templateUrl: 'footer.html',
                    controller: 'FooterController'
                }
            },
            role: RoleProvider.NONE
        });

        $stateProvider.state ('about', {
            url: '/about',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationController'
                },
                '@': {
                    templateUrl: 'about.html'
                }
            },
            role: RoleProvider.NONE
        });

        $urlRouterProvider.otherwise('home');

    }])

    .run (['$rootScope', '$state', '$cookies', 'UserService', 'Role', 'RoleManager', '$anchorScroll', '$log',
        function ($rootScope, $state, $cookies, UserService, Role, RoleManager, $anchorScroll, $log)
        {
            // 50px is the height of our fixed navigation bar and we add an additional 10px to avoid to the immediate
            // bottom of the navigation.
            $anchorScroll.yOffset = 50 + 10;

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $log.info ("[myApp] $stateChangeStart (checking permissions for destination state: " + toState.name + ")");
            if (toState.role === undefined || toState.role === Role.NONE) {
                // if no role is defined, then the route does not need to be secured and we can just continue to change
                // to it

                $log.info("[myApp] $stateChangeStart (route change accepted, requires no role)");
                return;
            } else {
                $log.info ("[myApp] $stateChangeStart (destination " + toState.name + " requires role '" + Role.getName (toState.role) + "'");
                // we need to check that the user is authenticated and has the right role.
                if (!(RoleManager.hasRole (toState.role))) {
                    event.preventDefault();
                    $log.info ("[myApp] $stateChangeStart (route change rejected, redirecting to 'home')");
                    $state.go ('home');
                    return;
                }
            }
            $log.info("[myApp] $stateChangeStart (route change accepted)");
        });

        $rootScope.$on ('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $log.error ("[myApp] $stateChangeError (toState: " + toState.name + ") with error: " + error);
            event.preventDefault ();
            $state.go ('home');
        });
        $rootScope.$on ('$stateNotFound', function (event, toState, toParams, fromState, fromParams) {
            $log.info ("[myApp] $stateNotFound (state: " + toState.name + ")");
        });
    }])

    .controller ('HomeCtrl', ['$rootScope', function ($rootScope) {
    }])

    .controller ('NavigationController', ['$scope', '$state', 'Role', 'RoleManager', 'UserService', '$log',
        function ($scope, $state, Role, RoleManager, UserService, $log)
    {
        $log.info ("[myApp] NavigationController running");

        $scope.Role = Role;
        $scope.getCurrentRole = UserService.getCurrentRole;
        $scope.hasRole = RoleManager.hasRole;

        $scope.switchRole = UserService.switchRole;

        $scope.logout = function () {
            UserService.logout ();
        }
    }])

    .controller ('FooterController', ['$scope', 'UserService', '$log', function ($scope, UserService, $log)
    {
        $log.info ("[myApp] FooterController running");
        $scope.show_footer = function ()
        {
            return !UserService.isLoggedIn ();
        };
    }])

    .controller ('LoginController', ['$scope', 'UserService', 'Role', '$log', function ($scope, UserService, RoleService, $log)
    {
        $scope.loginError = false;

        $scope.login = function ()
        {
            var loginResult = UserService.login ($scope.username, $scope.password);

            loginResult.then (
                function success (result) {
                    if (UserService.isLoggedIn())
                        UserService.switchRole (UserService.getCurrentRole ());
                },
                function error (result) {
                    $log.error("[myApp] LoginController: Error logging in.");
                    $scope.loginError = true;
                }
            );
        }
    }]);
