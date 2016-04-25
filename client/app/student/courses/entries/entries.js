angular.module('myapp.student.courses.entries', ['ui.router', 'ngSanitize', 'myapp.student.courses.entries.structure'])

    .config (['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider)
    {
        $stateProvider.state ('home.student.courses.entries', {
            url: '/entries/:entry_id',
            resolve: {
                entry_id: ['$stateParams', function ($stateParams)
                {
                    return $stateParams.entry_id;
                }]
            },
            templateUrl: 'student/courses/entries/entries.html',
            controller: 'EntriesCtrl',
            role: RoleProvider.STUDENT
        });
    }])

    .controller ('EntriesCtrl', ['$scope', 'UserService', '$log', function ($scope, UserService, $log)
    {
        $log.info ('[myApp] EntriesCtrl running');

        $scope.mode = UserService.mode;
    }]);
