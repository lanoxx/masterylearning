angular.module('common.mathmode', [])

    /**
     * The purpose of this directive is to have MathJax typeset the contents of the element that this directive
     * has been applied to.
     */
    .directive("mathmode", function() {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs",
                function($scope, $element) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                }]
        };
    });
