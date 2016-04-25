angular.module ('myApp.student', ['ui.router', 'ngSanitize'])

    .config (['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider)
    {
        $stateProvider.state ('home.student',
            {
                url: '/student',
                resolve: {
                    courseList: ['RestService', function (RestService)
                    {
                        return RestService.getCourseList ().get();
                    }]
                },
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
                role: RoleProvider.STUDENT
            })
    }])

    .controller ('StudentController', ['$scope', 'courseList', '$log', function ($scope, courseList, $log)
    {
        $log.info ("[myApp] StudentController running");

        $scope.active_courses = courseList;

        $scope.get_course_title = function (course)
        {
            var title = course.title + " " + course.period;

            return title;
        };
    }]);
