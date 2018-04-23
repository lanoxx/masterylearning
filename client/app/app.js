'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'ui.bootstrap',
    'ngCookies',
    'katex',
    'myapp.navigation',
    'myapp.footer',
    'myapp.services.roles',
    'myapp.services.user',
    'myapp.services.history',
    'myapp.services.http',
    'myApp.student',
    'myApp.student.courses',
    'myapp.student.courses.entries',
    'myapp.student.courses.entries.exercises',
    'myapp.student.courses.entries.flow',
    'myapp.teacher',
    'myapp.admin',
    'myapp.user',
    'myApp.user.profile',
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
                    templateUrl: 'app.html'
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

    .run (['$rootScope', '$state', '$q', '$cookies', 'UserService', 'Role', 'RoleManager', '$anchorScroll', '$log', '$location', '$transitions',
        function ($rootScope, $state, $q, $cookies, UserService, Role, RoleManager, $anchorScroll, $log, $location, $transitions)
        {
            // 50px is the height of our fixed navigation bar and we add an additional 10px to avoid to the immediate
            // bottom of the navigation.
            $anchorScroll.yOffset = 50 + 10;

            $transitions.onBefore({ }, function (transition) {

                var $to = transition.$to ();

                $log.info ("[myApp] $transition (checking permissions for destination state: " + $to.name + ", url: " + $location.url () + ")");
                if ($to.self.role === undefined || $to.self.role === Role.NONE) {
                    // if no role is defined, then the route does not need to be secured and we can just continue to
                    // change to it
                    $log.info ("[myApp] $transition (route change accepted, requires no role)");
                } else {
                    $log.info ("[myApp] $transition (destination " + $to.name + " requires role '" + Role.getName ($to.self.role) + "'");
                    // we need to check that the user is authenticated and has the right role.
                    if (!(RoleManager.hasRole ($to.self.role))) {
                        $log.info ("[myApp] $transition (route change rejected, redirecting to 'home')");

                        var originalDestination = encodeURI ($location.url ());
                        $location.url ("/home?redirect=" + originalDestination);

                        // returning false here will cancel the transition but does not throw an error.
                        return $q.reject({
                                             errorMessage: 'Authentication required.',
                                             authenticationRequired: true
                                         });
                    }
                }
                $log.info ("[myApp] $stateChangeStart (route change accepted)");
            });

            $state.defaultErrorHandler (function (error) {

                var detail = error.detail;
                if (detail && detail.authenticationRequired) {
                    // state change was aborted because user was not authenticated, this is not an error
                    return;
                }

                $log.error ("[myApp] $state (a routing error occured: " + error);
            })
        }])

    .controller ('LoginController', ['$scope', 'UserService', 'Role', '$log', '$location', function ($scope, UserService, RoleService, $log, $location)
    {
        $scope.loginError = false;

        $scope.login = function ()
        {
            var loginResult = UserService.login ($scope.username, $scope.password);

            loginResult.then (
                function success (result) {
                    if (!UserService.isLoggedIn())
                    {
                        $scope.loginError = true;
                        return;
                    }

                    /* Check if a '?redirect' query exists on the location URL and
                     * navigate there, otherwise switch to the users default role's
                     * home route. */
                    var queryParameters = $location.search();

                    if (queryParameters.redirect) {

                        var destination = decodeURI(queryParameters.redirect);

                        $location.url(destination);
                    } else {
                        UserService.switchRole (UserService.getCurrentRole ());
                    }
                },
                function error (result) {
                    $log.error("[myApp] LoginController: Error logging in.");
                    $scope.loginError = true;
                }
            );
        }
    }]);
