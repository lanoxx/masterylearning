angular.module('common.mathmode', [])

    .directive("mathmode", function() {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs",
                function($scope, $element, $attrs) {
                    console.log($element);
                    /*$scope.$watch($attrs.mathjaxBind, function(texExpression) {
                     var texScript = angular.element("<script type='math/tex'>")
                     .html(texExpression ? texExpression :  "");
                     $element.html("");
                     $element.append(texScript);
                     MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                     });*/
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                }]
        };
    });
