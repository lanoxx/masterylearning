angular.module ('myapp.student.courses.entries.flow', ['ui.router', 'ngSanitize', 'common.header', 'myapp.student.courses.entries.exercises', 'myapp.services.content'])

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
            controller: 'FlowController',
            reloadOnSearch: false
        });
    }])

    .controller ('FlowController', ['$scope', '$timeout', '$location', '$stateParams', 'course_id', 'entry_id', 'entries', 'HistoryService', '$sanitize', '$anchorScroll', '$log', '$sce',
        function ($scope, $timeout, $location, $stateParams, course_id, entry_id, entries, HistoryService, $sanitize, $anchorScroll, $log, $sce)
    {
        "use strict";

        $log.info ('[myApp] FlowController running');

        $scope.courseId = course_id;
        $scope.entryId = entry_id;
        $scope.depth = 0;
        $scope.entries = [];

        $scope.$on ('$locationChangeSuccess', function (event, newLocation, oldLocation)
        {
            $timeout (function () {
                $anchorScroll ($location.search ().location);
            }, 0);
        });

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

            // this part is only called if the 'continue from last position' was used
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
            if (next.length === 0) {
                return;
            }

            var enumerationPromise = HistoryService.enumerateEntries ()
                .save ({ courseId: course_id }, { entryIds: next })
                .$promise;

            enumerationPromise.then (function (enumerationResult)
            {
                $scope.entries.push.apply ($scope.entries, enumerationResult.entries);
                next = enumerationResult.nextIds;
                if (enumerationResult.entries && enumerationResult.entries[0])
                    $location.search ("location", "" + enumerationResult.entries[0].id);
            });
        }

        $scope.continue_cb = function ()
        {
            var entry = $scope.entries.pop ();

            HistoryService.setEntryState().save ({ courseId: entry.courseId, entryId: entry.id, state: "true" });

            load_next_content ();
        };

        $scope.answered_cb = function (entry, answer_model, answer)
        {
            var nextId = null;

            if (answer)
                // enumerate into the 'correct' subtree
                nextId = entry.correctId;
            else
                // enumerate into the 'incorrect' subtree
                nextId = entry.incorrectId;

            if (nextId)
                next.push (nextId);

            load_next_content();
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

                          if (initFunction) {
                              $log.info ("[myApp] myAppInitialize: calling function '" + initName + "' with data: " + initData);
                              initFunction (context.element[0], context.scope.entry.state, initObject, get_event_callback (scope), context);
                          } else {
                              $log.error ("myApp] myAppInitialize: tried to initialize an interactive content" +
                                  "element but the global function '" + initName + "' was not found");
                          }
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

                      init_callback ({ element: element, entry: scope.entry, scope: scope });
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
    }])

    .directive ('myAppScrollHandler', ['$anchorScroll', '$location', function ($anchorScroll, $location)
    {
        return {
            scope: {
                destination: '='
            },
            link: function (scope, element)
                  {
                      element.click (function ()
                      {
                          if (!scope.destination) {
                              return;
                          }

                          if (typeof destination !== 'string')
                              scope.destination = "" + scope.destination;

                          $anchorScroll (scope.destination);
                          $location.search("location", scope.destination);
                          scope.$apply ();
                      })
                  }
        }
    }]);
