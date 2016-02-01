angular.module('myapp.teacher', ['ui.router', 'myapp.services.database'])

    .config(['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state('home.teacher', {
            url: '/teacher',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationCtrl'
                },
                '@': {
                    templateUrl: 'teacher/teacher-home.html',
                    controller: 'TeacherCtrl'
                }
            },
            role: 'ROLE_TEACHER'
        });
    }
    ])

    .controller('TeacherCtrl', ['$scope', function ($scope)
    {
        
    }])
    
    .controller('CourseStorageController', ['$scope', 'database', '$log', function ($scope, database, $log)
    {
        $scope.course = {};
        $scope.section = {};
        $scope.courses = database.courses;

        $scope.save = function(course)
        {
            var db_course = new database.Course('fmi2', course.title, course.period, course.description);

            db_course.print();

            database.insert_course (db_course);

            $log.info('[myApp] CourseStorageController: Course saved');
        }
    }])

    .controller('SectionStorageController', ['$scope', 'database', '$log', function ($scope, database, $log)
    {
        $scope.section = {};
        $scope.courses = database.courses;
        $scope.get_sections = function () {
            return database.get_entries('section');
        };

        $scope.save = function(section)
        {
            var db_section = new database.Section(section.title, section.description);

            $log.info (db_section.toString());
            $log.debug ("Section.course_id: " + section.course_id);

            database.courses[section.course_id].add_entry(db_section);

            $log.info('[myApp] SectionStorageController: Section saved');
        }
    }])

    .controller('UnitStorageController', ['$scope', 'database', '$log', function ($scope, database, $log)
    {
        $scope.section = {};

        $scope.courses = database.courses;
        $scope.get_sections = function (course_id)
        {
            var sections = database.get_entries('section');
            var result = [];

            if (!course_id)
                return sections;

            sections.forEach (function (section)
            {
                if (section.course_id === course_id) {
                    result.push (section);
                }
            });
            return result;
        };

        $scope.get_units = function() {
            return database.get_entries ('unit');
        };

        $scope.save = function(unit)
        {
            var db_unit = new database.Unit(unit.full_title, unit.breadcrumb_title);

            unit.section.add_entry(db_unit);

            $log.info('[myApp] UnitStorageController: Unit saved');
        }
    }]);
