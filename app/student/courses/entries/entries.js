angular.module('myapp.student.courses.entries', ['ui.router'])

    .config (['$stateProvider', function ($stateProvider)
    {
        $stateProvider.state ('home.student.courses.entries', {
            url: '/entries/:entry_id',
            resolve: {
                entry: ['$stateParams', 'database', '$log', function ($stateParams, database, $log)
                {
                    var entries = {
                        11: {
                            id: 1,
                            type: 'unit',
                            course_id: 'fmi',
                            full_title: "Unit 1: Propositional Logic Formulas",
                            breadcrumb_title: "Unit 1",
                            description: "Unit 1 description",
                            next: 12,
                            prev: null,
                            entries: [
                                { id: 25, type: 'paragraph', paragraph_type: 'text', text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque fugit id numquam placeat, quasi ratione tempora vel. Assumenda atque blanditiis iusto nam nihil praesentium quibusdam quod similique sunt voluptatem. Totam."},
                                { id: 26, type: 'paragraph', paragraph_type: 'definition', text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque fugit id numquam placeat, quasi ratione tempora vel. Assumenda atque blanditiis iusto nam nihil praesentium quibusdam quod similique sunt voluptatem. Totam.",
                                    number: 1, title: "Syntax"
                                },
                                { id: 27, type: 'paragraph', paragraph_type: 'definition', text: 'Atomic propositions are symbols \\(a\\), \\(b\\), \\(c\\), ..., which can either have the value true or false.',
                                    number: 2, title: "Propositions", mode: 'math'
                                },
                                { id: 28, type: 'paragraph', paragraph_type: 'definition', text: 'A formula G is a subformula ... if ... \\( sub(\\top) = {\\top} \\)',
                                    number: 3, title: "Propositions", mode: 'math'
                                },
                                {
                                    id: 29, type: 'section', title: 'Parentheses', description: 'Explains handling of parantheses in logical formulas.'
                                }
                            ]
                        },
                        12: {
                            id: 12,
                            type: 'unit',
                            full_title: "Unit 2 Fulltitle",
                            breadcrumb_title: "Unit 2",
                            description: "Unit 2 description",
                            next: null,
                            prev: 11,
                            entries: [

                            ]
                        },
                        13: {
                            id: 13,
                            type: 'unit',
                            full_title: "Unit 1 Fulltitle",
                            breadcrumb_title: "Unit 1",
                            description: "Unit 1 description",
                            next: 2,
                            prev: null,
                            entries: [

                            ]
                        },
                        14: {
                            id: 14,
                            type: 'unit',
                            full_title: "Unit 2 Fulltitle",
                            breadcrumb_title: "Unit 2",
                            description: "Unit 2 description",
                            next: 2,
                            prev: null,
                            entries: [

                            ]
                        },
                        15: {
                            id: 15,
                            type: 'unit',
                            full_title: "Unit 1 Fulltitle",
                            breadcrumb_title: "Unit 1",
                            description: "Unit 1 description",
                            next: 2,
                            prev: null,
                            entries: [

                            ]
                        },
                        16: {
                            id: 16,
                            type: 'unit',
                            full_title: "Unit 2 Fulltitle",
                            breadcrumb_title: "Unit 2",
                            description: "Unit 2 description",
                            next: 2,
                            prev: null,
                            entries: [

                            ]
                        },
                        17: {
                            id: 17,
                            type: 'unit',
                            full_title: "Unit 1 Fulltitle",
                            breadcrumb_title: "Unit 1",
                            description: "Unit 1 description",
                            next: 2,
                            prev: null,
                            entries: [

                            ]
                        },
                        18: {
                            id: 18,
                            type: 'unit',
                            full_title: "Unit 2 Fulltitle",
                            breadcrumb_title: "Unit 2",
                            description: "Unit 2 description",
                            next: 2,
                            prev: null,
                            entries: [

                            ]
                        }
                    };

                    var db_entries = database.get_entries();

                    return db_entries[$stateParams.entry_id];
                }]
            },
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationCtrl'
                },
                '' : {
                    templateUrl: 'student/courses/entries/entries.html',
                    controller: 'EntriesCtrl'
                }
            },
            role: 'ROLE_STUDENT'
        })
    }])

    .directive("mathjaxBind", function ()
    {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs)
            {
                $scope.$watch($attrs.mathjaxBind, function (value)
                {
                    var $script = angular.element("<script type='math/tex'>")
                        .html(value == undefined ? "" : value);
                    $element.html("");
                    $element.append($script);
                    MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                });
            }]
        };
    })

    .controller ('EntriesCtrl', ['$scope', 'entry', '$log', function ($scope, entry, $log)
    {
        $log.info ('[myApp] EntriesCtrl running');
        if (entry.type == 'unit')
            $scope.unit = entry;
        else
            $scope.entry = entry;
        var i;
        for (i=0; i < entry.entries.length; i++) {
            var current_entry = entry.entries[i];
            MathJax.Hub.Typeset(current_entry.text);
        }

        $scope.expression="\\frac{5}{4} \\div \\frac{1}{6}";
    }]);
