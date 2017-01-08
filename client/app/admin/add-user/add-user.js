angular.module ('myapp.admin.adduser', [])

    .directive ('myAppAddUser', function ()
    {
        function AddUserController($scope, Role, UserService, $log) {

            $log.info ("[myapp.admin.adduser.myAppAddUser] AddUserController running");

            /**
             * If this directive is active.
             * @type {boolean}
             */
            $scope.active = false;

            $scope.user = null;
            $scope.roles = null;
            $scope.errors = null;

            $scope.usernameChangedCb = usernameChangedCb;
            $scope.confirmCb = confirmCb;
            $scope.cancelCb = cancelCb;

            $scope.controller.init = init;
            $scope.controller.cancel = cancel;

            function init() {
                $scope.user = {};
                $scope.roles = [true];
                $scope.active = true;
                $scope.errors = [];
            }

            function cancel () {
                $scope.active = false;
                $scope.user = null;
                $scope.roles = null;
                $scope.errors = [];
            }

            function cancelCb () {
                cancel();
                $scope.onCancel();
            }

            function confirmCb (user) {

                createUser();
            }

            function createUser () {

                $scope.user.roles = [];

                $scope.roles.forEach(function (role, index)
                {
                    if ($scope.roles[index])
                        $scope.user.roles.push (Role.getName (index + 1));
                });

                var createUserPromise = UserService.createUser ($scope.user);

                return createUserPromise.$promise.then (
                    function success (result)
                    {
                        $log.info ("[myApp.admin.adduser.myAppAddUser] AddUserController: saved user with username: " + $scope.user.username);

                        var user = $scope.user;

                        user.roles = result.roles;
                        user.username = result.username;

                        // 2. deactivate this directive
                        $scope.active = false;
                        $scope.user = null;
                        $scope.roles = null;
                        $scope.errors = [];

                        // 3. emit onConfirm
                        $scope.onConfirm ({user: user});
                    },
                    function error (result) {
                        $log.info ("[myApp.admin.adduser.myAppAddUser] AddUserController: failed to save the new user with username: " + $scope.user.username);

                        $scope.errors['addUser'] = true;
                    }
                )
            }

            function usernameChangedCb () {
                if ($scope.user && $scope.user.username) {
                    var regExp = /^[a-z0-9](-?[a-z0-9])*$/gi;
                    if (!regExp.test($scope.user.username)) {
                        $scope.usernamematches = false;
                        $scope.errors['username'] = true;
                    } else {
                        $scope.usernamematches = true;
                        $scope.errors['username'] = false;
                    }
                } else {
                    $scope.errors['username'] = false;
                    $scope.usernamematches = false;
                }
            }
        }

        return {
            templateUrl: 'admin/add-user/add-user.tpl.html',
            restrict: 'E',
            scope: {
                controller: '=',
                onConfirm: '&',
                onCancel: '&'
            },
            controller: ['$scope', 'Role', 'UserService', '$log', AddUserController]
        }
    });
