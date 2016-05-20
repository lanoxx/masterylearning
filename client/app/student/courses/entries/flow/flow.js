angular.module ('myapp.student.courses.entries.flow', ['ui.router', 'ngSanitize', 'myapp.student.courses.entries.exercises', 'myapp.services.content'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries.flow', {
            url: '/flow?location',
            resolve: {
                entries: ['course_id', 'entry_id', 'HistoryService','$log', function (course_id, entry_id, HistoryService, $log)
                {
                    return HistoryService.enumerateEntries ().save ( {courseId: course_id }, { entryIds: [ entry_id ]});
                }]
            },
            templateUrl: 'student/courses/entries/flow/flow.html',
            controller: 'FlowController'
        });
    }])

    .controller ('FlowController', ['$scope', '$timeout', '$location', '$stateParams', 'course_id', 'entries', 'HistoryService', '$sanitize', '$anchorScroll', '$log', '$sce',
        function ($scope, $timeout, $location, $stateParams, course_id, entries, HistoryService, $sanitize, $anchorScroll, $log, $sce)
    {
        "use strict";

        $log.info ('[myApp] FlowController running');

        $scope.depth = 0;
        $scope.entries = [];
        $scope.scrollTo = function (id)
        {
            $location.search("location="+ id);
            $anchorScroll(id);
        };

        $scope.trust = function (value)
        {
            if (value)
                return $sce.trustAsHtml(value).toString();

            return null;
        };

        var next = [];

        entries.$promise.then (function ()
        {
            $scope.entries = entries.entries;
            next = entries.nextIds;
            $log.info ("[myApp] FlowController: Rendering " + $scope.entries.length + " entries.");
            if ($stateParams.location) {
                $timeout (function ()
                {
                    $log.info ("[myApp] FlowController: Scrolling to location " + $stateParams.location);
                    $anchorScroll($stateParams.location);
                }, 0);
            }

        });

        function load_next_content ()
        {
            var enumerationPromise = HistoryService.enumerateEntries ()
                .save ({ courseId: course_id }, { entryIds: next })
                .$promise;

            enumerationPromise.then (function (enumerationResult)
            {
                $scope.entries.push.apply ($scope.entries, enumerationResult.entries);
                next = enumerationResult.nextIds;
            });
        }

        $scope.continue_cb = function ()
        {
            $scope.entries.pop ();

            load_next_content (next);
        };

        $scope.answered_cb = function (entry, answer_model, answer)
        {
            //TODO: store (entry.id, answer) somewhere in the user context

            var nextId = null;

            if (answer)
                // enumerate into the 'correct' subtree
                nextId = entry.correctId;
            else
                // enumerate into the 'incorrect' subtree
                nextId = entry.incorrectId;

            if (nextId)
                next.push (nextId);

            load_next_content(next);
        };

        $scope.sanitize = function (text)
        {
            return $sanitize (text);
        };
    }])

    .directive ('myAppInitialize', ['$timeout', '$log', '$q', function ($timeout, $log, $q)
    {
        return {
            scope: {
                entry: '='
            },
            link: function (scope, element)
                  {
                      function init_callback (context)
                      {
                          var initData = context.entry.initData;
                          var initObject = JSON.parse (initData);
                          var initName = context.entry.init;
                          var initFunction = window[initName];

                          $log.info ("[myApp] myAppInitialize: calling function '" + initName + "' with data: " + initData);
                          initFunction(context.element[0], context.scope.entry.state, initObject, get_event_callback(scope), context);
                      }

                      function get_event_callback (scope) {
                          "use strict";
                          return function (data)
                          {
                              var deferred = $q.defer ();

                              scope.deferred = deferred;
                              scope.state = data.state;
                              scope.$apply();

                              return deferred.promise;
                          }
                      }

                      $timeout (init_callback, 0, false, { element: element, entry: scope.entry, scope: scope });
                  },
            controller: ['$scope', 'HistoryService', function ($scope, HistoryService)
            {
                $scope.$watch ('state', function (state)
                {
                    if (!state) return;

                    $log.info ('[myAppInitialize] State has changed: ' + state);
                    persist_state(state);
                });

                function persist_state (state) {
                    "use strict";
                    $log.info ('persisting state: ' + state);
                    $log.info ('course id' + $scope.entry.courseId);
                    HistoryService.setEntryState().save ({ courseId: $scope.entry.courseId, entryId: $scope.entry.id, state: state }).$promise.then (function ()
                    {
                        if ($scope.deferred) {
                            $scope.deferred.resolve (true);
                        }
                        $log.info ('success');
                    }, function ()
                    {
                        if ($scope.deferred) {
                            $scope.deferred.reject (false);
                        }
                        $log.info ('error');
                    });
                }
            }]
        }
    }]);
