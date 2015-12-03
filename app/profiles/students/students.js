angular.module('myApp.profiles.students', [])

    .config (['$stateProvider', function ($stateProvider) {
    $stateProvider.state ('student.profile', {
        url: '/profile',
        templateUrl: 'profiles/students/students.html'
    })
}]);
