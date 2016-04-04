'use strict';

angular.module('myApp.student.courses', ['ui.router', 'myapp.services.rest'])

    .config (['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state ('home.student.courses', {
            url: '/courses/:course_id',
            resolve: {
                entries: ['$stateParams', 'RestService', '$log', function ($stateParams, RestService, $log)
                {
                    $log.info ("[myApp] $stateProvider (resolving 'home.student.courses' with course_id=" + $stateParams.course_id + ")");

                    var course = RestService.getCourseTableOfContents ().get ({courseId: $stateParams.course_id});

                    $log.debug("[myApp] $stateProvider (resolved course(id=" + course.id + ", title=" + course.title + "))");

                    return course;
                }],
                course_id: ['$stateParams', function ($stateParams)
                {
                    return $stateParams.course_id;
                }]
            },
            templateUrl: 'student/courses/courses.html',
            controller: 'CourseController',
            role: 'ROLE_STUDENT'
        });
    }])

    .controller('CourseController', ['$scope', 'course_id', 'courseList', 'entries', 'UserService', '$log', function ($scope, course_id, courseList, entries, UserService, $log) {

        if (courseList.$resolved) {
            courseList.forEach (function (course)
            {
                if (course.id == course_id) {
                    $scope.course = course;
                }
            })
        }

        // TODO: depending on the mode we need two strategies for enumerating the entries:
        //       For structure mode we enumerate until units
        //       For flow mode we enumerate only sections and subsections
        $scope.entries = entries;

        $scope.mode = UserService.mode;
    }]);

