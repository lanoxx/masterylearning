angular.module('myApp.profiles.students', [])

    .config (['$stateProvider', function ($stateProvider) {
    $stateProvider.state ('profiles.students', {
        url: '/students',
        templateUrl: 'profiles/students/students.html'
    })
}]);
