angular.module ('myapp.user', ['common.password'])

    .config (['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
    {
        $urlRouterProvider.when ('/user', '/home');

        $stateProvider.state ('user', {
            url: '/user'
        });

        $stateProvider.state ('user.recovery', {
            url: '/password/resetToken',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationController'
                },
                '@': {
                    templateUrl: 'user/passwordReset.html',
                    controller:  'PasswordResetController'
                }
            }
        });

        $stateProvider.state ('user.recovery.password', {
            url: '/:token/user/:userId',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationController'
                },
                '@': {
                    templateUrl: 'user/passwordReset.html',
                    controller:  'PasswordResetController'
                }
            }
        })
    }])

    .controller ('PasswordResetController', ['$scope', '$stateParams', 'UserService',
        function ($scope, $stateParams, UserService)
        {
            $scope.token = $stateParams.token;
            $scope.userId = $stateParams.userId;
            $scope.user = {};
            $scope.requestSent = false;
            $scope.resetRequestSucceeded = null;

            $scope.requestResetToken = function ()
            {
                var resetResult = UserService.requestResetToken ($scope.user.username);

                resetResult.then (
                    function onSuccess (result)
                    {
                        "use strict";
                        $scope.requestSent = true;
                        $scope.resetRequestSucceeded = result.success;
                    },
                    function onError (result)
                    {
                        "use strict";
                        $scope.requestSent = true;
                        $scope.resetRequestSucceeded = false;
                    }
                )
            };

            $scope.resetPassword = function (newPassword)
            {
                return UserService.resetPassword (newPassword, $stateParams.userId, $stateParams.token);
            }

        }]);
