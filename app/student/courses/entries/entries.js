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
                }],
                entry_id: ['$stateParams', function ($stateParams)
                {
                    return $stateParams.entry_id;
                }]
            },
            templateUrl: 'student/courses/entries/entries.html',
            controller: 'EntriesCtrl',
            role: 'ROLE_STUDENT'
        });

        $stateProvider.state ('home.student.courses.entries.structure', {
            url: '/structure',
            resolve: {
                entry: ['$stateParams', 'course_id', 'entry_id', 'database', '$log', function ($stateParams, course_id, entry_id, database, $log)
                {
                    var db_entries = database.get_entries();

                    return db_entries[entry_id];
                }]
            },
            templateUrl: 'student/courses/entries/structure/structure.html',
            controller: 'StructureController'
        });
    }])

    .controller ('EntriesCtrl', ['$scope', 'entry', '$log', function ($scope, entry, $log)
    {
        $log.info ('[myApp] EntriesCtrl running');
        if (entry.type == 'unit')
            $scope.unit = entry;
        else
            $scope.entry = entry;
    }])

    .controller ('StructureController', ['$scope', 'entry', '$log', function ($scope, entry, $log)
    {
        $log.info ('[myApp] StructureController running');
        if (entry.type == 'unit')
            $scope.unit = entry;
        else
            $scope.entry = entry;
    }]);
