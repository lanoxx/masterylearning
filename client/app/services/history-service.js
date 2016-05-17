angular.module ('myapp.services.history', ['ngResource', 'myapp.config'])

    .provider ('HistoryService', [function HistoryServiceProvider()
    {
        var apiUrlPrefix;

        function HistoryService ($resource) {
            "use strict";

            this.getActiveCourses = function ()
            {
                return $resource (apiUrlPrefix + "/userHistory/activeCourses");
            };

            this.getCourseTableOfContents = function ()
            {
                return $resource (apiUrlPrefix + "/userHistory/courses/:courseId", {courseId: '@courseId'});
            };

            this.enumerateEntries = function ()
            {
                return $resource (apiUrlPrefix + "/userHistory/courses/:courseId/enumerate/:entryId",
                    {courseId: '@courseId', entryId: '@entryId'}
                );
            }

        }

        this.$get = ['$resource', 'Configuration', function ($resource, Configuration)
        {
            apiUrlPrefix = Configuration.getApiUrl ();
            return new HistoryService ($resource);
        }];
    }]);
