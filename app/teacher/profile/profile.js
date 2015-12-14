angular.module('myApp.teacher.profile', [])

.config (['$stateProvider', function ($stateProvider) {
    $stateProvider.state ('home.teacher.profile', {
        url: '/profile',
        templateUrl: 'teacher/profile/profile.html',
        controller: 'TeachersCtrl',
        role: 'ROLE_TEACHER'
    })
}])

.controller('TeachersCtrl', [ '$scope',
    function ($scope) {
        $scope.tabs =  [
            { title:'Dynamic Title 1', content:'Dynamic content 1' },
            { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
        ];
    }
]);
