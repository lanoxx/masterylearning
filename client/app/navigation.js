angular.module ('myapp.navigation', ['ui.router', 'myapp.services.user', 'myapp.services.roles'])

    .controller ('NavigationController', ['$scope', '$state', 'Role', 'RoleManager', 'UserService', '$log',
        function ($scope, $state, Role, RoleManager, UserService, $log)
        {
            $log.info ("[myApp] NavigationController running");

            $scope.Role = Role;
            if (UserService.currentUser) {
                $scope.fullname = UserService.currentUser.fullname;
                if (!$scope.fullname) {
                    $scope.fullname = UserService.currentUser.username;
                }
            }
            $scope.getCurrentRole = UserService.getCurrentRole;
            $scope.hasRole = RoleManager.hasRole;

            $scope.switchRole = UserService.switchRole;

            $scope.logout = function ()
            {
                UserService.logout ();
            }
        }]);
