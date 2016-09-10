angular.module ('myapp.admin', ['ui.router'])

    .config (['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider)
    {
        $stateProvider.state ('home.admin', {
            url: '/admin',
            resolve: {
                users: ['UserService', function (UserService)
                       {
                           return UserService.loadUsers ().query();
                       }]
            },
            views: {
                '@': {
                    templateUrl: 'admin/admin-home.html',
                    controller: 'AdminController'
                }
            },
            role: RoleProvider.ADMIN
        });
    }])

    .controller ('AdminController', ['$scope', 'users', 'UserService', 'Role', '$log', function ($scope, users, UserService, Role, $log)
    {
        $scope.Role = Role;
        $scope.users = users;
        $scope.roles = [true];
        $scope.createUserActive = false;
        $scope.newUser = null;

        $scope.errors = [];
        $scope.usernamematches = false;

        $scope.createUser = createUser;
        $scope.addUser = addUser;
        $scope.cancel = cancel;
        $scope.roleCheckedCb = roleCheckedCb;
        $scope.usernameChangedCb = usernameChangedCb;

        function roleCheckedCb () {

            $scope.newUser.roles = [];

            $scope.roles.forEach(function (role, index)
            {
                if ($scope.roles[index])
                    $scope.newUser.roles.push (Role.getName (index + 1));
            })
        }

        function usernameChangedCb () {
            if ($scope.newUser && $scope.newUser.username) {
                var regExp = /^[a-z0-9](-?[a-z0-9])*$/gi;
                if (!regExp.test($scope.newUser.username)) {
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

        function addUser () {
            "use strict";
            $scope.newUser = {};
            $scope.createUserActive = true;
        }

        function createUser ()
        {
            var createUserPromise = UserService.createUser ($scope.newUser);

            createUserPromise.$promise.then (
                function success (result)
                {
                    $scope.newUser.roles = result.roles;
                    $scope.newUser.username = result.username;

                    $scope.users.push ($scope.newUser);
                    $scope.newUser = null;
                    $scope.createUserActive = false;
                    $log.info ("[myApp] AdminController: saved user with username: " + $scope.newUser.username);
                },
                function error (result) {
                    $log.info ("[myApp] AdminController: failuser to save the new user with username: " + $scope.newUser.username);
                }
            )
        }

        function cancel () {
            $scope.createUserActive = false;
        }
    }]);
