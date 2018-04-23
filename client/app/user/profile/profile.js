angular.module ('myApp.user.profile', [])

    .config (['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider)
    {
        $stateProvider.state ('user.profile', {
            url: '/profile',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationController'
                },
                '@': {
                    templateUrl: 'user/profile/profile.html',
                    controller: 'ProfileController'
                }
            },
            role: RoleProvider.STUDENT
        })
    }])

    .controller ('ProfileController', ['$scope', 'UserService', '$log', function ($scope, UserService, $log)
    {
        $scope.currentUser = UserService.currentUser;
        $scope.errors = {};

        $scope.changePassword = function ()
        {
            $log.info ("[myApp] Profile: Attempting to change user password");

            if ($scope.newpassword === $scope.newpasswordrepeat) {
                var changePasswordPromise = UserService.changePassword ($scope.oldpassword, $scope.newpassword);

                changePasswordPromise.then (function (result)
                {
                    $scope.passwordChangeSuccess = result.passwordChanged;
                }, function ()
                {
                    $scope.errors['passwordChange'] = true;
                });
            } else {
                $scope.errors['newpasswordrepeat'] = true;
            }
        };

        $scope.newpassword_changed_cb = function ()
        {
            var different = $scope.newpassword !== $scope.newpasswordrepeat;
            $scope.errors['newpasswordrepeat'] = different;

            $scope.passwordsMatch = $scope.newpassword.length > 0 && !different;
        };
    }]);
