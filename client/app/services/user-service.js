angular.module ('myapp.services.user', ['ngResource', 'base64', 'myapp.config'])

    .factory ('UserService', ['Configuration', '$state', '$cookies', '$resource', '$http', '$base64', 'Role', 'RoleManager', '$q', '$log',
        function UserServiceFactory(Configuration, $state, $cookies, $resource, $http, $base64, Role, RoleManager, $q, $log)
    {
        var apiUrlPrefix = Configuration.getApiUrl() || "";

        function UserService()
        {
            var loggedIn = false;
            var currentRole = Role.NONE;

            this.currentUser = null;

            function setCurrentRole (role)
            {
                currentRole = role;
            }

            function getCurrentRole ()
            {
                return currentRole;
            }

            this.setCurrentRole = setCurrentRole;
            this.getCurrentRole = getCurrentRole;

            this.isLoggedIn = function ()
            {
                return loggedIn;
            };

            this.logout = function ()
            {
                setCurrentRole (Role.NONE);
                RoleManager.removeAll ();
                this.currentUser = null;
                loggedIn = false;
                $state.go ('home');
            };

            this.login = function (username, password)
            {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode(username + ":" + password);

                var userOutDto = $resource (apiUrlPrefix + "/users/current", null, {method: 'GET' }).get();

                var loginSuccess = function LoginSuccess(result)
                {
                    $log.info ("[myApp] UserService.login successful.");
                    result.roles.forEach (function (role, index)
                    {
                        RoleManager.addRole(role);
                    });

                    this.setCurrentRole (Role.fromName (result.roles[0]));
                    this.currentUser = result;
                    loggedIn = true;

                    return result;

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

            this.requestResetToken = function (username)
            {
                "use strict";

                var url = apiUrlPrefix + "/password/resetToken";

                $log.debug ("[myApp] UserService: requesting resetToken at: " + url + " for username: " + username);

                var resetResult = $resource (url).save ({ username: username });

                return resetResult.$promise.then (
                    function onSuccess (result)
                    {
                        $log.info ("[myApp] UserService: " + result.message);
                        return result;
                    }
                );
            };

            this.resetPassword = function (newPassword, userId, token) {
                "use strict";

                var url = apiUrlPrefix + '/password/resetToken/' + token;

                $log.debug ("[myApp] UserService: requesting password reset at url: " + url);

                var resetPasswordResult = $resource (url).save ( {userId: userId, password: newPassword} );

                return resetPasswordResult.$promise.then (
                    function onSuccess (result)
                    {
                        $log.info ("[myApp] UserService: " + (result.message || "Passwort Reset successful"));
                        return result;
                    },
                    function onError (result)
                    {
                        $log.error ("[myApp] UserService: " + (result.message || "Error while resetting the password."));
                        return result;
                    }
                )
            };

            /**
             * This will attempt to set the new role in the role service and if successful switches the route
             * according to the new role.
             *
             * @param {number|int} role A valid role as defined in Role, NONE and LAST are not considered valid roles.
             */
            this.switchRole = function (role)
            {
                $log.info ("[myApp] Switching application role to " + Role.getName (role));

                if (role) {
                    this.setCurrentRole (role);
                    $state.go (Role.getRoute (role));
                }
            }.bind(this);
        }

        UserService.prototype.set_mode = function (mode)
        {
            this.mode = mode;
        };

        return new UserService();
    }]);
