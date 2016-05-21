'use strict';

angular.module('myApp.student.courses', ['ui.router', 'myapp.services.history'])

    .config (['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider) {
        $stateProvider.state ('home.student.courses', {
            url: '/courses/:course_id',
            resolve: {
                entries: ['$stateParams', 'HistoryService', '$log', function ($stateParams, HistoryService, $log)
                {
                    $log.info ("[myApp] $stateProvider (resolving 'home.student.courses' with course_id=" + $stateParams.course_id + ")");

                    var entries = HistoryService.getCourseTableOfContents ().query ({courseId: $stateParams.course_id});

                    return entries;
                }],
                course_id: ['$stateParams', function ($stateParams)
                {
                    return $stateParams.course_id;
                }]
            },
            templateUrl: 'student/courses/courses.html',
            controller: 'CourseController',
            role: RoleProvider.STUDENT
        });
    }])

    .controller('CourseController', ['$scope', 'course_id', 'courseList', 'entries', 'UserService', '$log', function ($scope, course_id, courseList, entries, UserService, $log) {

        if (courseList.$resolved) {
            courseList.forEach (function (course)
            {
                if (course.courseOutDto.id == course_id) {
                    $scope.course = course.courseOutDto;
                }
            })
        }

        // TODO: depending on the mode we need two strategies for enumerating the entries:
        //       For structure mode we enumerate until units
        //       For flow mode we enumerate only sections and subsections
        $scope.entries = entries;
        $scope.course_id = course_id;

        $scope.mode = UserService.mode;
    }]);

