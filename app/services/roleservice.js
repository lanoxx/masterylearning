angular.module ('myApp.services.roles', [])

    /**
     * Enum Implementation based on:
     * https://stijndewitt.wordpress.com/2014/01/26/enums-in-javascript/
     **/

.factory ('RoleService', [
    function Roles() {

        var RoleEnum = Object.freeze({
            NONE: 0,
            STUDENT: 1,
            TEACHER: 2,
            LAST: 3,
            properties: {
                0: { name: '',    value: 0},
                1: { name: 'student', value: 1},
                2: { name: 'teacher', value: 2}
            }
        });

        return {
            currentRole: RoleEnum.NONE,
            NONE: RoleEnum.NONE,
            STUDENT: RoleEnum.STUDENT,
            TEACHER: RoleEnum.TEACHER,
            LAST: RoleEnum.LAST,
            properties: RoleEnum.properties,
            setRole: function setRole(role) {
                if (role >= RoleEnum.LAST) {
                    return false;
                }
                if (typeof role === 'string') {
                    this.currentRole = RoleEnum[role];
                } else {
                    this.currentRole = role;
                }
                return true;
            },
            getCurrentProperty: function () {
                return this.properties[this.currentRole];
            }
        }
    }
]);
