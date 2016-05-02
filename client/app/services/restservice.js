/**
 * Created by sebastiangeiger on 30/03/16.
 */

angular.module ('myapp.services.rest', ['ngResource', 'myapp.config'])

    //
    .provider ('RestService', function RestServiceProvider ()
    {
        var apiUrlPrefix = "";

        function RestService ($resource) {
            this.$resource = $resource;
            "use strict";

            this.getCourseTableOfContents = function (id)
            {
                return $resource (apiUrlPrefix + "/userHistory/courses/:courseId/entryHistory", {courseId: '@courseId'});
            };

            this.getCourseList = function ()
            {
                return $resource (apiUrlPrefix + "/userHistory/activeCourses", null, { get: { method: 'GET', isArray: true } } );
            };

            this.enumerateEntries = function ()
            {
                return $resource (apiUrlPrefix + "/courses/:courseId/enumerate/:entryId", null, { get: { method: 'GET' } } )
            }
        }

        this.$get = ['Configuration', '$resource', function (Configuration, $resource)
        {
            apiUrlPrefix = Configuration.getApiUrl ();
            return new RestService($resource);
        }]

    });
