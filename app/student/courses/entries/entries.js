angular.module('myapp.student.courses.entries', ['ui.router'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries', {
            url: '/entries/:entry_id',
            resolve: {
                entry: ['$stateParams', 'database', '$log', function ($stateParams, database, $log)
                {
                    var db_entries = database.get_entries();

                    return db_entries[$stateParams.entry_id];
                }]
            },
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationCtrl'
                },
                '' : {
                    templateUrl: 'student/courses/entries/entries.html',
                    controller: 'EntriesCtrl'
                }
            },
            role: 'ROLE_STUDENT'
        })
    }])

    .controller ('EntriesCtrl', ['$scope', 'entry', '$log', function ($scope, entry, $log)
    {
        $log.info ('[myApp] EntriesCtrl running');
        if (entry.type == 'unit')
            $scope.unit = entry;
        else
            $scope.entry = entry;
    }]);
