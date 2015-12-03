'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my role service', function() {

    beforeEach(module('myApp.services.roles'));

    var RoleService;

    beforeEach(inject(function (_RoleService_) {
        RoleService = _RoleService_;
    }));

    it ('should be able to switch between roles', function () {
        expect(RoleService.currentRole).toEqual(RoleService.NONE);

        RoleService.setRole(2);

        expect(RoleService.currentRole).toEqual(RoleService.TEACHER);
    });

    it('should have a "student" property that can be used to set the role', function () {
        expect(RoleService.currentRole).toEqual(RoleService.NONE);

        RoleService.setRole(RoleService.TEACHER);

        expect(RoleService.currentRole).toEqual(RoleService.TEACHER);
    });

    it('should have the properties of a student', function () {
        expect(RoleService.currentRole).toEqual(RoleService.NONE);

        RoleService.setRole(RoleService.STUDENT);

        expect(RoleService.properties[RoleService.currentRole].name).toEqual('student');
    });

    it('should fail when a wrong role is set', function () {
        expect(RoleService.setRole(RoleService.LAST)).toBeFalsy();
    });

    it('should return the right property for the current role', function () {
        expect(RoleService.setRole(RoleService.TEACHER)).toBeTruthy();

        expect(RoleService.getCurrentProperty().name).toEqual('teacher');
    });
});
