angular.module ('common.password', [])

/**
 * @requestOldPassword: if the directive should present a field where the old password must be entered.
 * @changePassword: The function to pass the new and old password to, if the @requestOldPassword flag is set, then
 *                  the function should accept the old password as first parameter. This function must return an
 *                  object (or promise) which contains a 'passwordChanged' property to indicate if changing the
 *                  password was successful.
 */
    .directive ('myAppPassword', function ()
    {
        function PasswordController ($scope, $q, $log)
        {
            "use strict";

            $scope.oldPassword = null;
            $scope.newPassword = null;
            $scope.newPasswordRepeat = null;
            $scope.passwordsMatch = false;
            $scope.errors = {};
            $scope.onNewPasswordChanged = onNewPasswordChanged;
            $scope.changePassword = changePassword;

            function changePassword ()
            {
                $log.info ("[common.password] myAppPassword: Attempting to change user password");

                if ($scope.newPassword === $scope.newPasswordRepeat) {
                    var changePasswordPromise;
                    if ($scope.requestOldPassword) {
                        changePasswordPromise = $scope.onChangePassword ({oldPassword: $scope.oldPassword, newPassword: $scope.newPassword});
                    } else {
                        changePasswordPromise = $scope.onChangePassword ({newPassword: $scope.newPassword});
                    }

                    $q.when (changePasswordPromise).then (
                        function onSuccess (result)
                        {
                            $scope.passwordChangeSuccess = result.passwordChanged;
                        },
                        function onError ()
                        {
                            $scope.errors['passwordChange'] = true;
                        });
                } else {
                    $scope.errors['newPasswordRepeat'] = true;
                }
            }

            function onNewPasswordChanged ()
            {
                var different = $scope.newPassword !== $scope.newPasswordRepeat;
                $scope.errors['newPasswordRepeat'] = different;

                $scope.passwordsMatch = $scope.newPassword.length > 0 && !different;
            }
        }

        return {
            scope: {
                requestOldPassword: '=',
                onChangePassword:   '&onChangePassword'
            },
            templateUrl: 'components/password/password.html',
            controller:  ['$scope', '$q', '$log', PasswordController]
        }
    });
