'use strict';

angular.module('myApp.student.courses', ['ui.router', 'myapp.services.database'])

    .config (['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state ('home.student.courses', {
            url: '/courses/:course_id',
            resolve: {
                course: ['$stateParams', 'database', '$log', function ($stateParams, database, $log)
                {
                    $log.info ("[myApp] $stateProvider (resolving 'home.student.courses' with course_id=" + $stateParams.course_id + ")");

                    var course = database.courses[$stateParams.course_id];

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

    .controller('CourseController', ['$scope', 'course', 'UserService', function ($scope, course, UserService) {

        $scope.course = course;

        // TODO: depending on the mode we need two strategies for enumerating the entries:
        //       For structure mode we enumerate until units
        //       For flow mode we enumerate only sections and subsections
        $scope.entries = [];

        $scope.mode = UserService.mode;
    }]);

