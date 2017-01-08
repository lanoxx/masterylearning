angular.module ('myapp.admin', [
    'ui.router',
    'myapp.admin.edituser',
    'myapp.admin.adduser',
    'myapp.admin.deleteuser'
])

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

    .controller ('AdminController', ['$scope', 'users', 'UserService', 'Role', '$log', '$q', function ($scope, users, UserService, Role, $log, $q)
    {
        $scope.disabled = false;

        $scope.users = users;

        //
        // EDIT USER
        //
        $scope.editUserController = {};

        $scope.editUserCb = function (user)
        {
            $scope.editUserController.init (user);
            $scope.disabled = true;
        };

        $scope.editUserCancelCb = function ()
        {
            $scope.disabled = false;
        };

        $scope.editUserConfirmCb = function ()
        {
            $scope.disabled = false;
        };

        //
        // ADD USER
        //
        $scope.addUserController = {};

        $scope.addUserCb = function ()
        {
            $scope.addUserController.init ();
            $scope.disabled = true;
        };

        $scope.addUserCancelCb = function ()
        {
            $scope.disabled = false;
        };

        $scope.addUserConfirmCb = function (user)
        {
            if (user) {
                $scope.users.push (user);
            }

            $scope.disabled = false;
        };

        //
        // DELETE USER
        //
        $scope.deleteUserController = {};

        $scope.deleteUserCb = function (user)
        {
            $scope.disabled = true;
            $scope.deleteUserController.init (user);
        };

        $scope.deleteUserCancelCb = function ()
        {
            $scope.disabled = false;
        };

        $scope.deleteUserConfirmCb = function (user)
        {
            _.pull(users, user);

            $scope.disabled = false;
        };
    }]);
