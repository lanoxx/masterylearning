angular.module ('myapp.student.courses.entries.structure', ['ui.router', 'ngSanitize'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries.structure', {
            url: '/structure',
            resolve: {
                entry: ['$stateParams', 'course_id', 'entry_id', 'database', '$log', function ($stateParams, course_id, entry_id, database, $log)
                {
                    var db_entries = database.get_course (course_id).get_entries();

                    return db_entries[entry_id];
                }]
            },
            templateUrl: 'student/courses/entries/structure/structure.html',
            controller: 'StructureController'
        });
    }])

    .controller ('StructureController', ['$scope', 'entry', '$log', '$sanitize', function ($scope, entry, $log, $sanitize)
    {
        $log.info ('[myApp] StructureController running');
        if (entry.data.type == 'unit')
            $scope.unit = entry;
        else
            $scope.entry = entry;

        $scope.sanitize = function (text)
        {
            return $sanitize (text);
        }
    }]);
