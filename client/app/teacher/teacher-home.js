angular.module('myapp.teacher', [
    'ui.router',
    'ngSanitize',
    'myapp.services.course',
    'myapp.teacher.edit',
    'myapp.teacher.statistics'
])

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

    .controller('TeacherCtrl', ['$scope', 'courses', 'CourseService', 'StatisticService', '$sce', '$log',
        function ($scope, courses, CourseService, StatisticService, $sce, $log)
    {
        $scope.courses = courses;

        $scope.trust = trust;

        $scope.truncateAndTrust = function (string, length)
        {

            var clippedString = text_clipper_clipHtmlclip (string, length);
            return trust(clippedString);
        };

        function trust (value)
        {
            if (value)
                return $sce.trustAsHtml(value).toString();

            return null;
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
