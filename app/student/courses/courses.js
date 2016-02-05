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
            controller: 'LecturesCtrl',
            role: 'ROLE_STUDENT'
        });
    }])

    .controller('LecturesCtrl', ['$state', '$scope', 'course', 'database', function ($state, $scope, course, database) {
        /**
         * We bind the current lecture that was resolved in the 'student.lecture' state to the scope, so
         * it can be rendered in the template.
         */
        $scope.course = course;
    }]);

