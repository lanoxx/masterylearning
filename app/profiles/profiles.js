angular.module('myApp.profiles', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('profiles', {
            url: '/profiles',
            templateUrl: 'profiles/profiles.html'
        })
    }]);
