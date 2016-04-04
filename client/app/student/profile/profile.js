angular.module('myApp.student.profile', [])

    .config (['$stateProvider', function ($stateProvider) {
    $stateProvider.state ('home.student.profile', {
        url: '/profile',
        templateUrl: 'student/profile/profile.html',
        role: 'ROLE_STUDENT'
    })
}]);
