angular.module ('myApp.student', ['ui.router', 'ngSanitize', 'myapp.services.history'])

    .config (['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider)
    {
        $stateProvider.state ('home.student',
            {
                url: '/student',
                resolve: {
                    courseList: ['HistoryService', function (HistoryService)
                    {
                        return HistoryService.getActiveCourses ().query();
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

    .controller ('StudentController', ['$scope', 'HistoryService', 'courseList', '$log', function ($scope, HistoryService, courseList, $log)
    {
        $log.info ("[myApp] StudentController running");

        $scope.active_courses = courseList;

        $scope.get_course_title = function (course)
        {
            var title = course.title + " " + course.period;

            return title;
        };

        $scope.refreshActiveCourses = function ()
        {
            var courseListPromise = HistoryService.getActiveCourses ().query();

            courseListPromise.$promise.then (
                function onSuccess (result)
                {
                    "use strict";
                    $scope.active_courses = result;
                }
            );
        }
    }]);
