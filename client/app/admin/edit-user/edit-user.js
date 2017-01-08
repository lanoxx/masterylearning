angular.module('myapp.admin.edituser', [])

.directive ('myAppEditUser', function ()
{
    function EditUserController($scope, Role, UserService, $log) {
        "use strict";

        $log.info ("[myapp.admin.edituser.myAppEditUser] EditUserController running");

        /**
         * If this directive is active.
         * @type {boolean}
         */
        $scope.active = false;

        $scope.user = null;
        $scope.roles = null;
        $scope.Role = Role;

        // Setup controller to expose the API methods of this directive
        $scope.controller.init = init;
        $scope.controller.cancel = cancel;

        // Bind callbacks to the template scope
        $scope.cancelCb = cancelCb;
        $scope.confirmCb = confirmCb;

        function init(user) {

            $scope.user = user;

            $scope.roles = Role.values ().map (function (roleValue, index)
            {
                return !!_.find (user.roles, function (roleName)
                {
                    return roleValue === Role.fromName (roleName);
                });
            });

            $scope.active = true;
        }

        function cancelCb() {
            cancel();
            $scope.onCancel ();
        }

        function cancel () {
            $scope.active = false;
            $scope.user = null;
            $scope.roles = null;
        }

        function confirmCb() {

            // 1. submit the new roles
            updateRolesForUser ();

            // 2. deactivate this directive
            $scope.active = false;
            $scope.roles = null;

            // 3. emit onConfirm
            $scope.onConfirm();
        }

        function updateRolesForUser ()
        {
            /** @type Array.<String> */
            var existingRoles = $scope.user.roles;

            var username = $scope.user.username;

            var rolesToDelete = [];
            var rolesToAdd = [];

            $scope.roles.forEach (function (role, index)
            {
                var roleName = Role.getName (index + 1);

                if (role) {
                    // role is checked but does no exist
                    if (!_.includes (existingRoles, roleName)) {
                        rolesToAdd.push (roleName);
                    }
                } else {
                    // role is unchecked but exists
                    if (_.includes (existingRoles, roleName)) {
                        rolesToDelete.push (roleName)
                    }
                }
            });

            var updateRolesPromise = UserService.updateRoles (username, rolesToAdd, rolesToDelete);

            updateRolesPromise.$promise.then (
                function success (result)
                {
                    var roles = $scope.user.roles;

                    _.pullAll (roles, result.rolesDeleted);

                    [].push.apply (roles, result.rolesAdded);

                    roles.sort (function (a,b)
                    {
                        return Role.fromName (a) - Role.fromName (b);
                    });
                },
                function error (result)
                {
                    $log.error ("[myapp.admin.edituser] myAppEditUser: an error occurred while adjusting the roles.");
                }
            );
        }
    }

    return {
        restrict: 'E',
        templateUrl: "admin/edit-user/edit-user.tpl.html",
        scope: {
            controller: '=',
            onCancel: '&',
            onConfirm: '&'
        },
        controller: ['$scope', 'Role', 'UserService', '$log', EditUserController]
    };
});
