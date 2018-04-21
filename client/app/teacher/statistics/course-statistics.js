angular.module ('myapp.teacher.statistics', ['myapp.services.statistic', 'myapp.teacher.histogram'])

       .config(['$stateProvider', 'RoleProvider', function ($stateProvider, RoleProvider)
       {
           $stateProvider.state('home.teacher.statistics', {
               url: '/course/:courseId/statistics',
               views: {
                   '': {
                       templateUrl: 'teacher/statistics/course-statistics.html',
                       controller: 'CourseStatisticsController'
                   }
               },
               resolve: {
                   statistics: ['StatisticService', '$stateParams', function (StatisticService, $stateParams)
                   {
                       var courseId = $stateParams.courseId;

                       return StatisticService.getStatistics ()
                                              .get ({courseId: courseId });

                   }],
                   course: ['CourseService', '$stateParams', function (CouseService, $stateParams) {
                       var courseId = $stateParams.courseId;

                       return CouseService.getCourse(courseId);
                   }]
               },
               role: RoleProvider.TEACHER
           });
       }])

       .controller ('CourseStatisticsController', ['$scope', 'course', 'statistics', '$log', function ($scope, course, statistics, $log) {

           $log.info ('[myApp.teacher.statistics] CourseStatisticsController running');

           $scope.statistics = statistics;

           statistics.$promise.then (function(statistics) {

               $scope.statistics = statistics;

               /* Updated by the pagination widget. */
               $scope.currentPage = 1;
               $scope.totalItems = statistics.historyEntriesPerUsers.length;
           });

           $scope.courseTitle = course.title;
           $scope.coursePeriod = course.period;

           $scope.getStatisticsView = getStatisticsView;

           function getStatisticsView () {

               if (!statistics.$resolved) {
                   return statistics;
               }

               return statistics.historyEntriesPerUsers.slice (($scope.currentPage - 1) * 10, $scope.currentPage * 10);
           }

       }]);
