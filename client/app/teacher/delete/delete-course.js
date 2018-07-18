require ('./delete-course.html');

angular.module ('myapp.teacher.delete', [])

       .config (['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider) {

           $stateProvider.state ('home.teacher.delete-course', {
               url: '/courses/:courseId/delete',
               views: {
                   '': {
                       templateUrl: 'teacher/delete/delete-course.html',
                       controller: 'DeleteCourseController'
                   }
               },
               resolve: {
                      course: ['CourseService', '$stateParams', function (CourseService, $stateParams) {
                         var courseId = $stateParams.courseId;

                         return CourseService.getCourse(courseId);
                      }]
               },
               role: RoleProvider.TEACHER
           });
       }])

       .controller ('DeleteCourseController', ['$scope', 'course', 'CourseService', '$state',
           function ($scope, course, CourseService, $state)
           {
                  $scope.course = course;

                  $scope.delete_cb = function () {
                      var deleteResult = CourseService.deleteCourse ().delete({courseId: course.id});

                      deleteResult.$promise.then (function success (result) {
                          console.log (result);

                          $state.go ("^", null, {reload: true});

                      }, function error (error) {
                          console.error(error);
                      });
                  }
           }]);
