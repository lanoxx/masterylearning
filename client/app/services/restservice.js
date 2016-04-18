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
                return $resource (apiUrlPrefix + "/courses/:courseId", {courseId: '@courseId'}, { get: { method: 'GET', isArray: true } } );
            };

            this.getCourseList = function ()
            {
                return $resource (apiUrlPrefix + "/courses", null, { get: { method: 'GET', isArray: true } } );
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
