angular.module ('myapp.student.courses.entries.flow', ['ui.router', 'ngSanitize', 'myapp.student.courses.entries.exercises', 'myapp.services.content'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries.flow', {
            url: '/flow?location',
            resolve: {
                entries: ['course_id', 'entry_id', 'HistoryService','$log', function (course_id, entry_id, HistoryService, $log)
                {
                    return HistoryService.enumerateEntries ().get( {courseId: course_id, entryId: entry_id });
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
            return $sce.trustAsHtml(value).toString();
        };

        var next = [];

        entries.$promise.then (function ()
        {
            $scope.entries = entries.entries;
            next.push(entries.nextId);
            $log.info ("[myApp] FlowController: Rendering " + $scope.entries.length + " entries.");
            if ($stateParams.location) {
                $timeout (function ()
                {
                    $log.info ("[myApp] FlowController: Scrolling to location " + $stateParams.location);
                    $anchorScroll($stateParams.location);
                }, 0);
            }

        });

        function load_next_content (nextEntryId)
        {
            var enumerationPromise = HistoryService.enumerateEntries ()
                .get( {courseId: course_id, entryId: nextEntryId })
                .$promise;

            enumerationPromise.then (function (enumerationResult)
            {
                $scope.entries.push.apply ($scope.entries, enumerationResult.entries);
                next.push (enumerationResult.nextId);
            });
        }

        $scope.continue_cb = function ()
        {
            $scope.entries.pop ();

            var nextEntryId = next.pop ();

            load_next_content (nextEntryId);
        };

        $scope.answered_cb = function (entry, answer_model, answer)
        {
            //TODO: store (entry.id, answer) somewhere in the user context

            var nextEntryId;
            if (answer)
                // get the correct entry of the exercise
                nextEntryId = entry.correct;
            else
                nextEntryId = entry.incorrect;

            if (!nextEntryId)
                nextEntryId = next.pop();
            else {
                next.push (entries.nextId);
            }

            load_next_content(nextEntryId);
        };

        $scope.sanitize = function (text)
        {
            return $sanitize (text);
        };
    }])

    .directive ('myAppInitialize', ['$timeout', function ($timeout)
    {
        return {
            scope: {
                contentObject: '='
            },
            link: function (scope, element, attributes)
                  {
                      function init_callback (context)
                      {
                          var initData = context.contentObject.initData;
                          var initObject = JSON.parse (initData);
                          var initName = context.contentObject.init;
                          var initFunction = window[initName];

                          console.log ("[myApp] myAppInitialize: calling function '" + initName + "' with data: " + initData);
                          initFunction(context.element[0], initObject);
                      }

                      $timeout (init_callback, 0, false, { element: element, attributes: attributes, contentObject: scope.contentObject });

                      console.log ('fooobar');
                  }
        }
    }]);
