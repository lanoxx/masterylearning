angular.module('myapp.teacher', ['ui.router', 'myapp.services.course', 'myapp.services.statistic'])

    .config(['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider)
    {
        $stateProvider.state('home.teacher', {
            url: '/teacher',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationController'
                },
                '@': {
                    templateUrl: 'teacher/teacher-home.html',
                    controller: 'TeacherCtrl'
                }
            },
            resolve: {
                courses: ['CourseService', function (CourseService)
                {
                    return CourseService.getCourseList ().query ();
                }]
            },
            role: RoleProvider.TEACHER
        });
    }
    ])

    .controller('TeacherCtrl', ['$scope', 'courses', 'CourseService', 'StatisticService', '$log', function ($scope, courses, CourseService, StatisticService, $log)
    {
        $scope.courses = courses;
        $scope.statistics = null;

        $scope.courseEditMode = false;

        $scope.edit_cb = edit_cb;
        $scope.save_cb = save_cb;
        $scope.cancel_cb = cancel_cb;

        $scope.loadStatistics = loadStatistics;

        function loadStatistics ($index)
        {
            $scope.statistics = StatisticService.getStatistics ().get ({courseId: $scope.courses[$index].id });
        }

        function edit_cb ($index)
        {
            $scope.courseEditMode = true;

            var editCourse = $scope.courses[$index];

            $scope.course = {
                id: editCourse.id,
                title: editCourse.title,
                period: editCourse.period,
                description: editCourse.description
            };
        }

        function save_cb ()
        {
            var updatePromise = CourseService.updateCourse ().save ({ courseId: $scope.course.id }, $scope.course);

            updatePromise.$promise.then (function (result)
            {
                $log.info ("Update result" + result);
            });

            $scope.courseEditMode = false;
        }

        function cancel_cb () {
            $scope.courseEditMode = false;
        }
    }])

.filter ('percent', function ()
{
    return function (input, precision)
    {
        var number = input * 100;

        if (precision)
            number = number.toFixed (precision);

        return number + "%";
    }
});
