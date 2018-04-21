angular.module ('myapp.services.course', ['ngResource', 'myapp.config'])

.provider ('CourseService', [function CourseServiceProvider ()
{
    var apiUrlPrefix;

    function CourseService ($resource) {
        "use strict";

        this.getCourse = function(courseId)
        {
            if (typeof courseId === "string")
            {
                courseId = parseInt (courseId, 10);
            }

            var filterCoursesByCourseId = function (courses) {
                return courses.find (function (course) {
                    if (course.id === courseId) {
                        return course;
                    }
                })
            };

            return $resource (apiUrlPrefix + "/courses")
                .query()
                .$promise
                .then(filterCoursesByCourseId);
        };

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
