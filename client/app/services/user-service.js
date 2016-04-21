angular.module ('myapp.services.user', ['ngResource', 'base64', 'myapp.config'])

    .factory ('UserService', ['Configuration', '$state', '$cookies', '$resource', '$http', '$base64', 'RoleService', '$q', '$log',
        function UserServiceFactory(Configuration, $state, $cookies, $resource, $http, $base64, RoleService, $q, $log)
    {
        var apiUrlPrefix = Configuration.getApiUrl() || "";

        function UserService()
        {
            var loggedIn = false;

            this.currentUser = null;
            this.role = "ROLE_GUEST";

            this.mode = "flow";
            this.isLoggedIn = function ()
            {
                return loggedIn;
            };

            this.logout = function ()
            {
                loggedIn = false;
            };

            this.login = function (username, password)
            {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode(username + ":" + password);

                var userOutDto = $resource (apiUrlPrefix + "/users/current", null, {method: 'GET' }).get();

                var loginSuccess = function LoginSuccess(result)
                {
                    this.role = "ROLE_STUDENT";
                    this.currentUser = result;
                    loggedIn = true;
                }.bind (this);

                var loginFailed = function (result)
                {
                    $log.error ("[myApp] UserService.login failed.");

                    return $q.reject ("Login Failed");
                };

                return userOutDto.$promise.then (loginSuccess, loginFailed);
            };

            this.changePassword = function (oldpassword, newpassword)
            {
                var changePasswordResource = $resource (apiUrlPrefix + "/users/current/password");
                var success = changePasswordResource.save ( { oldPassword: oldpassword, newPassword: newpassword } );

                return success.$promise.then (function (result)
                    {
                        $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode (this.currentUser.username + ":" + newpassword);

                        return result;
                    }.bind (this),
                    function ()
                    {
                        $log.error ("[myApp] UserService.changePassword failed.")
                    }
                )
            };

            /**
             * This will attempt to set the new role in the role service and if successful switches the route
             * according to the new role.
             *
             * @param role A valid role from the RoleService
             */
            this.switchRole = function (role)
            {
                $log.info ("[myApp] Switching application role to " + role);

                if (RoleService.setRole(role)) {
                    if (role == RoleService.STUDENT) {
                        UserService.role = 'ROLE_STUDENT';
                        $cookies.put('role', 'ROLE_STUDENT');
                        $cookies.put('currentUser', this.currentUser.username);
                        $state.go('home.student');
                    }
                    if (role == RoleService.TEACHER) {
                        UserService.role = 'ROLE_TEACHER';
                        $cookies.put('role', 'ROLE_TEACHER');
                        $cookies.put('currentUser', this.currentUser.username);
                        $state.go('home.teacher');
                    }
                    if (role == RoleService.NONE) {
                        console.log ('[myApp].NavigationController: Logging out. Switching security role to ROLE_GUEST');
                        UserService.role = 'ROLE_GUEST';
                        UserService.currentUser = null;
                        $cookies.remove('role');
                        $cookies.remove('currentUser');
                        $cookies.remove('mode');
                        $state.go('home');
                    }
                }
            }.bind(this);
        }

        UserService.prototype.set_mode = function (mode)
        {
            this.mode = mode;
        };

        return new UserService();
    }]);
