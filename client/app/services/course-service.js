angular.module ('myapp.services.course', ['ngResource', 'myapp.config'])

.provider ('CourseService', [function CourseServiceProvider ()
{
    var apiUrlPrefix;

    function CourseService ($resource) {
        "use strict";

        this.getCourseList = function ()
        {
            return $resource (apiUrlPrefix + "/courses");
        };

        this.updateCourse = function ()
        {
            return $resource (apiUrlPrefix + "/courses/:courseId", {courseId: "@courseId"});
        }

    }

    this.$get = ['$resource', 'Configuration', function ($resource, Configuration)
    {
        apiUrlPrefix = Configuration.getApiUrl ();
        return new CourseService ($resource);
    }];
}]);
