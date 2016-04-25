angular.module ('myapp.user', ['common.password'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('user', {
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

        $stateProvider.state ('user.password', {
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
            $scope.resetRequestSucceeded = false;

            $scope.requestResetToken = function ()
            {
                var resetResult = UserService.requestResetToken ($scope.user.username);

                resetResult.then (
                    function onSuccess (result)
                    {
                        "use strict";
                        $scope.resetRequestSucceeded = true;
                    },
                    function onError (result)
                    {
                        "use strict";

                    }
                )
            };

            $scope.resetPassword = function (newPassword)
            {
                return UserService.resetPassword (newPassword, $stateParams.userId, $stateParams.token);
            }

        }]);
