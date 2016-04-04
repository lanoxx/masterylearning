angular.module ('myapp.student.courses.entries.structure', ['ui.router', 'ngSanitize'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries.structure', {
            url: '/structure',
            resolve: {
                entry: ['$stateParams', 'course_id', 'entry_id', 'database', '$log', function ($stateParams, course_id, entry_id, database, $log)
                {
                    return database.get_course (course_id).get_entry(entry_id);
                }]
            },
            templateUrl: 'student/courses/entries/structure/structure.html',
            controller: 'StructureController'
        });
    }])

    .controller ('StructureController', ['$scope', 'ContentService', 'entry', '$log', '$sanitize', function ($scope, ContentService, entry, $log, $sanitize)
    {
        $log.info ('[myApp] StructureController running');

        var content = new ContentService (entry, never_block_cb, filter_strategy_cb);

        function never_block_cb (entry)
        {
            return false;
        }

        function filter_strategy_cb (entry)
        {
            return entry.data.type !== 'exercise'
                   && entry.data.type !== 'continue-button';
        }

        $scope.entries = content.enumerate_subtree();

        $scope.sanitize = function (text)
        {
            return $sanitize (text);
        }
    }]);
