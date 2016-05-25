angular.module ("common.header", [])

.directive ("myAppHeader", function ()
{
    return {
        scope: {
            level: "="
        },
        transclude: true,
        templateUrl: "components/header/header.html"
    };
});
