angular.module ('myApp.student', ['ui.router', 'ngSanitize'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student', {
            url: '/student',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationController'
                },
                '@': {
                    templateUrl: 'student/student-home.html',
                    controller: 'StudentController'
                }
            },
            role: 'ROLE_STUDENT'
        })
    }])

    .controller ('StudentController', ['$scope', 'UserService', 'CourseHistory', 'database', '$log', function ($scope, UserService, CourseHistory, database, $log)
    {
        $log.info ("[myApp] StudentController running");

        $scope.active_courses = UserService.active_courses;

        $scope.get_course_title = function (course_id)
        {
            var course;

            course = database.get_course (course_id);

            return course.title + " " + course.period;
        };
    }]);
