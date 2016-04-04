/**
 * Created by sebastiangeiger on 30/03/16.
 */

angular.module ('myapp.services.rest', ['ngResource'])

    //
    .provider ('RestService', function RestServiceProvider ()
    {
        var apiAddress;
        var apiPort;
        var apiPath;

        this.setAddress = function (address)
        {
            apiAddress = address;
        };

        this.setPort = function (port)
        {
            apiPort = port;
        };

        this.setPath = function (path)
        {
            apiPath = path;
        };

        function RestService ($resource) {
            this.$resource = $resource;
            "use strict";

            this.getCourseTableOfContents = function (id)
            {
                return $resource ("http://localhost:8080/courses/:courseId", {courseId: '@courseId'}, { get: { method: 'GET', isArray: true } } );
            };

            this.getCourseList = function ()
            {
                return $resource ("http://localhost:8080/courses", null, { get: { method: 'GET', isArray: true } } );
            };

            this.enumerateEntries = function ()
            {
                return $resource ("http://localhost:8080/courses/:courseId/enumerate/:entryId", null, { get: { method: 'GET' } } )
            }
        }

        this.$get = ['$resource', function ($resource)
        {
            return new RestService($resource);
        }]

    });
