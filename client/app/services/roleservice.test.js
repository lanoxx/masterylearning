'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my role service', function() {

    beforeEach(module('myapp.services.roles'));

    var Role;
    var RoleManager;

    beforeEach(inject(function (_Role_, _RoleManager_) {
        Role = _Role_;
        RoleManager = _RoleManager_;
    }));
    
    it ('should be able to add roles by symbol', function ()
    {
        RoleManager.addRole (Role.STUDENT);
        
        expect (RoleManager.hasRole (Role.STUDENT)).toBeTruthy();
    });

    it ('should be able to add roles by symbol', function ()
    {
        RoleManager.addRole ('STUDENT');

        expect (RoleManager.hasRole (Role.STUDENT)).toBeTruthy();
    });

    it ('should be able to handle multiple roles', function ()
    {
        expect (RoleManager.hasRole(Role.STUDENT)).toBeFalsy();
        expect (RoleManager.hasRole(Role.TEACHER)).toBeFalsy();

        RoleManager.addRole (Role.STUDENT);
        RoleManager.addRole (Role.TEACHER);

        expect (RoleManager.hasRole(Role.STUDENT)).toBeTruthy();
        expect (RoleManager.hasRole(Role.TEACHER)).toBeTruthy();
    });

    it ('should have a route property of each valid role', function ()
    {
        expect (Role.getRoute (Role.STUDENT)).not.toEqual ('');
        expect (Role.getRoute (Role.STUDENT)).not.toEqual (null);

        expect (Role.getRoute (Role.TEACHER)).not.toEqual ('');
        expect (Role.getRoute (Role.TEACHER)).not.toEqual (null);
    });
});
