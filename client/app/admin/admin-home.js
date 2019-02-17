angular.module ('myapp.admin', [
    'ui.router',
    'myapp.admin.edituser',
    'myapp.admin.adduser',
    'myapp.admin.deleteuser',
    'myapp.admin.addmultipleuser'
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
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationController'
                },
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

        $scope.currentPage = 1;
        $scope.totalItems = users.length;
        $scope.users = users;

        $scope.getUserView = function ()
        {
            return users.slice (($scope.currentPage - 1) * 10, $scope.currentPage * 10);
        };

        /**
         * update totalItems when the promise has been resolved
         * to ensure that the pagination widget renders correctly.
         */
        users.$promise.then (function (users)
                             {
                                 $scope.totalItems = users.length;
                             });

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

        //
        // ADD MULTIPLE USERS
        //
        $scope.addMultipleUsersController = {};

        $scope.addMultipleUsersCb = function ()
        {
            $scope.disabled = true;
            $scope.addMultipleUsersController.init();
        };

        $scope.addMultipleUsersCancelCb = function ()
        {
            $scope.disabled = false;
        };

        $scope.addMultipleUsersConfirmCb = function (createdUsers)
        {
            $scope.disabled = false;

            [].push.apply ($scope.users, createdUsers);
        };
    }]);
