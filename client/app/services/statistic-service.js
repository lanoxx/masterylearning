angular.module ('myapp.services.statistic', ['ngResource', 'myapp.config'])

    .provider ('StatisticService', [function StatisticServiceProvider ()
    {
        var apiUrlPrefix;

        function StatisticService ($resource) {
            "use strict";

            this.getStatistics = function ()
            {
                return $resource (apiUrlPrefix + "/statistics/courseHistory/:courseId", {courseId: "@courseId"});
            }
        }

        this.$get = ['$resource', 'Configuration', function ($resource, Configuration)
        {
            apiUrlPrefix = Configuration.getApiUrl ();
            return new StatisticService ($resource);

        }];
    }]);
