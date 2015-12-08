angular.module('myApp.profiles.students', [])

    .config (['$stateProvider', function ($stateProvider) {
    $stateProvider.state ('home.student.profile', {
        url: '/profile',
        templateUrl: 'profiles/students/students.html',
        role: 'ROLE_STUDENT'
    })
}]);
