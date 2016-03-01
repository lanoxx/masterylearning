angular.module ('myapp.services.user', [])

    .service ('UserService', [function ()
    {
        this.currentUser = null;
        this.role = "ROLE_GUEST";
    }]);
