require ('./import-course.html');

angular.module ('myapp.teacher.import-course', [
    'ui.router',
    'common.file-upload'
])
       .config (['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider) {

           $stateProvider.state ('home.teacher.import', {
                                     url: '/course/import',
                                     views: {
                                         '': {
                                             templateUrl: 'teacher/import/import-course.html',
                                             controller: 'ImportCourseController'
                                         }
                                     },
                                     role: RoleProvider.TEACHER
                                 });

       }])

        .controller ('ImportCourseController', ['$scope', 'CourseService', '$state',
            function($scope, CourseService, $state)
            {
                $scope.file = {};
                $scope.hasFile = false;

                $scope.dataLoadedCb = function ()
                {
                    if (!$scope.file.data) {
                        return false;
                    }

                    $scope.hasFile = true;

                    var courseJson = $scope.file.data;

                   var createCourseResult = CourseService.createCourse().save (courseJson);

                    createCourseResult.$promise.then (function () {
                       console.log ("Course Created");

                       $state.go ("^", null, {reload: true});

                   }, function error (error) {
                        console.log (error);
                    });
                };
            }]);
