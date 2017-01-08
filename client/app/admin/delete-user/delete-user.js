angular.module ('myapp.admin.deleteuser', [])

    .directive ('myAppDeleteUser', function ()
    {
        function DeleteUserController ($scope, UserService, $log) {

            $scope.active = false;
            $scope.user = null;

            $scope.controller.init = init;

            function init(user)
            {
                $scope.active = true;
                $scope.user = user;
            }

            $scope.cancelCb = function ()
            {
                $scope.active = false;
                $scope.user = null;

                $scope.onCancel();
            };

            $scope.confirmCb = function (user)
            {
                var deletePromise = UserService.deleteUser (user.username);

                deletePromise.$promise.then(
                    function success(result)
                    {
                        var user = $scope.user;

                        $log.info ('[myapp.admin.deleteuser.myAppDeleteUser] DeleteUserController: successfully deleted user: ' + user.username);

                        $scope.user = null;
                        $scope.active = false;

                        $scope.onConfirm({user: user});
                    },
                    function error(result) {
                        $log.error ('[myapp.admin.deleteuser.myAppDeleteUser] DeleteUserController: could not delete user');
                    }
                )
            };
        }

        return {
            templateUrl: 'admin/delete-user/delete-user.tpl.html',
            restrict: 'E',
            scope: {
                controller: '=',
                onCancel: '&',
                onConfirm: '&'
            },
            controller: ['$scope', 'UserService', '$log', DeleteUserController]
        }
    });
