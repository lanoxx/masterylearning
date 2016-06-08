angular.module ('myapp.footer', ['ui.router', 'myapp.services.user'])

    .controller ('FooterController', ['$scope', 'UserService', '$log', function ($scope, UserService, $log)
    {
        $log.info ("[myApp] FooterController running");
        $scope.show_footer = function ()
        {
            return !UserService.isLoggedIn ();
        };
    }]);
