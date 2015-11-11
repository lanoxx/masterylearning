angular.module('myApp.profiles.teachers', [])

.config (['$stateProvider', function ($stateProvider) {
    $stateProvider.state ('profiles.teachers', {
        url: '/teachers',
        templateUrl: 'profiles/teachers/teachers.html'
    })
}]);
