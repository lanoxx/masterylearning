angular.module ('myapp.services.roles', [])

    /**
     * Enum Implementation based on:
     * https://stijndewitt.wordpress.com/2014/01/26/enums-in-javascript/
     **/
    .provider ('Role', [
        function RoleProvider ()
        {
            var $log = angular.injector (['ng'], true).get ('$log');

            var RoleEnum = Object.freeze ({
                NONE:       0,
                STUDENT:    1,
                TEACHER:    2,
                ADMIN:      3,
                LAST:       4,
                properties: {
                    0: {name: '', value: 0},
                    1: {name: 'STUDENT', value: 1, route: 'home.student'},
                    2: {name: 'TEACHER', value: 2, route: 'home.teacher'},
                    3: {name: 'ADMIN', value: 3, route: 'home.admin'}
                }
            });

            this.NONE = RoleEnum.NONE;
            this.STUDENT = RoleEnum.STUDENT;
            this.TEACHER = RoleEnum.TEACHER;
            this.ADMIN = RoleEnum.ADMIN;
            this.LAST = RoleEnum.LAST;

            function fromName (roleName)
            {
                // convert role name to symbol
                var role = Object.keys (RoleEnum.properties).find (function (key)
                {
                    if (RoleEnum.properties[key].name === roleName) {
                        return true;
                    }
                });

                return role ? RoleEnum.properties[role].value : undefined;
            }

            function getName (ordial)
            {
                if (ordial < RoleEnum.NONE || ordial >= RoleEnum.LAST) {
                    return undefined;
                }
                return RoleEnum.properties[ordial].name;
            }

            function getRoute (ordial)
            {
                if (ordial < RoleEnum.NONE || ordial >= RoleEnum.LAST) {
                    return undefined;
                }
                return RoleEnum.properties[ordial].route;
            }

            function values ()
            {
                return [RoleEnum.STUDENT, RoleEnum.TEACHER, RoleEnum.ADMIN];
            }

            this.fromName = fromName;
            this.getName = getName;
            this.getRoute = getRoute;

            var Role = Object.freeze ({
                NONE:     RoleEnum.NONE,
                STUDENT:  RoleEnum.STUDENT,
                TEACHER:  RoleEnum.TEACHER,
                ADMIN:    RoleEnum.ADMIN,
                LAST:     RoleEnum.LAST,
                fromName: fromName,
                getName:  getName,
                getRoute: getRoute,
                values:   values
            });

            this.$get = function ()
            {
                return Role;
            };
        }
    ])

    .provider ('RoleManager', ['RoleProvider',
        function RoleManagerProvider (RoleProvider)
        {
            "use strict";

            var roles = [];
            var $log = angular.injector (['ng'], true).get ('$log');

            /**
             * Adds a role to the current set of roles. If the current set of roles already contains the role then this
             * function does nothing.
             *
             * @param {string|int} role The name of the role to be added.
             * @returns {boolean} true if the role was added, false otherwise.
             */
            function addRole (role)
            {
                "use strict";
                var roleOrdial = 0;

                if (typeof role === 'string') {
                    roleOrdial = RoleProvider.fromName (role);
                } else {
                    if (role > RoleProvider.NONE && role < RoleProvider.LAST) {
                        roleOrdial = role;
                    }
                }

                if (roleOrdial && roles.indexOf (roleOrdial) === -1) {
                    $log.info ("[myApp.services.roles] RoleService: adding role " + role);
                    roles.push (roleOrdial);
                    return true;
                }

                return false;
            }

            /**
             * Removes a role from the current set of roles.
             *
             * @param {string|int} role The name of the role to be removed.
             * @returns {boolean} if the role was successfully removed.
             */
            function removeRole (role)
            {
                "use strict";

                var roleIndex = -1;

                if (typeof role === "string") {
                    var roleOrdial = RoleProvider.fromName (role);
                    roleIndex = roles.indexOf (roleOrdial);
                } else {
                    if (role >= RoleProvider.NONE && role < RoleProvider.LAST) {
                        roleIndex = roles.indexOf (role);
                    }
                }

                if (roleIndex !== -1) {
                    roles.splice (roleIndex, 1);
                    return true;
                }

                return false;
            }

            function removeAll ()
            {
                roles = [];
            }

            /**
             * Checks if the given roles in contained in the current set of roles
             * @param {string|int} role The role to be checked
             * @returns {number|boolean}
             */
            function hasRole (role)
            {
                "use strict";
                var roleOrdial = 0;

                if (typeof role === "string") {
                    roleOrdial = RoleProvider.fromName (role);
                } else {
                    roleOrdial = role;
                }

                return roleOrdial && roles.indexOf (roleOrdial) !== -1;
            }

            function RoleManager ()
            {
                this.addRole = addRole;
                this.removeRole = removeRole;
                this.removeAll = removeAll;
                this.hasRole = hasRole;
            }

            this.$get = function ()
            {
                return new RoleManager;
            };

        }]);

