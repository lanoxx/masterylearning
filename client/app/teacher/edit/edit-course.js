angular.module('myapp.teacher.edit', ['ui.router'])

       .config(['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider)
       {
           $stateProvider.state('home.teacher.edit-course', {
               url: '/course/:courseId/edit',
               views: {
                   '': {
                       templateUrl: 'teacher/edit/edit-course.html',
                       controller: 'CourseEditController'
                   }
               },
               resolve: {
                   course: ['CourseService', '$stateParams', function (CourseService, $stateParams)
                   {
                       var courseId = $stateParams.courseId;

                       return CourseService.getCourse(courseId);
                   }]
               },
               role: RoleProvider.TEACHER
           });
       }])

       .controller('CourseEditController', ['$scope', '$state', '$stateParams', 'course', 'CourseService', '$log',
                                            function ($scope, $state, $stateParams, course, CourseService, $log)
       {
           $log.info ('[myApp.teacher.edit] CourseEditController running');

           $scope.error = false;
           $scope.course = course;
           $scope.save_cb = save_cb;
           $scope.cancel_cb = cancel_cb;

           function save_cb ()
           {
               var updatePromise = CourseService.updateCourse ().save ({ courseId: $scope.course.id }, $scope.course);

               updatePromise.$promise.then (function (result)
                                            {
                                                $log.info ("[myapp.teacher.edit.CourseEditController: Update course result: " + result);

                                                $state.go ('^', null, { reload: true });
                                            },
                                            function (error) {
                                                $scope.error = true;
                                                $scope.errorMessage = error;
                                            });
           }

           function cancel_cb () {
               $state.go ('^');
           }
       }]);
