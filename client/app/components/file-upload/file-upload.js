angular.module ('common.file-upload', [])
/**
 * References:
 *   https://www.html5rocks.com/en/tutorials/file/dndfiles/
 *
 *
 */
.directive ('fileUpload', function ()
{
    function FileUploadController ($scope)
    {
        this.emitLoadEvent = function ()
        {
            $scope.fileOnLoad();
        };
    }

    function link (scope, element, attributes, controllers)
    {
        var fileUploadController = controllers[0];
        var ngModelController = controllers[1];

        element.bind ('change', function (changeEvent)
        {
            var file = changeEvent.target.files[0];

            if (file === undefined) {
                return;
            }

            var fileReader = new FileReader ();

            fileReader.onload = function (loadEvent)
            {
                var data = loadEvent.target.result;

                ngModelController.$setViewValue(data);

                fileUploadController.emitLoadEvent();

                scope.$apply();
            };

            fileReader.readAsText(file);
        });
    }

    return {
        require: ['fileUpload', 'ngModel'],
        restrict: 'A',
        scope: {
            fileOnLoad: '&'
        },
        controller: ['$scope', FileUploadController],
        link: link
    }
});
