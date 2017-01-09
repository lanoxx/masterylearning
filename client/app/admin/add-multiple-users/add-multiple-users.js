angular.module ('myapp.admin.addmultipleuser', [])

    .directive ('myAppAddMultipleUsers', function ()
    {
        function AddMultipleUsersController($scope, UserService, $log, $window) {

            $log.info ("[myapp.admin.addmultipleuser.myAppAddMultipleUser] AddMultipleUserController running");

            $scope.fileSupport = !!$window.FileReader;

            var reset = function () {
                $scope.active = false;
                $scope.disabled = true;
                $scope.hasFile = false;
                $scope.usersCreated = false;

                $scope.settings = {};
                $scope.file = {};
                $scope.users = [];
                $scope.createdUsers = [];
            };
            reset();

            $scope.controller.init = init;

            function init() {
                $scope.active = true;
            }

            $scope.cancelCb = function ()
            {
                reset();

                $scope.onCancel();
            };

            $scope.closeCb = function ()
            {
                var createdUsers = $scope.createdUsers;

                reset ();

                $scope.onConfirm({createdUsers: createdUsers});
            };

            function submitNextChunk () {

                var chunk = $scope.users.splice(0, 5);

                var createMultipleUsersPromise = UserService.createUsers(chunk);

                var chunkPromise = createMultipleUsersPromise.$promise.then (
                    function success (result) {

                        $scope.usersCreated = true;

                        [].push.apply($scope.createdUsers, result.users);

                        return $scope.users.length > 0;
                    },
                    function error (result) {

                    }
                );

                chunkPromise.then (function (moreUsers)
                {
                    if (moreUsers) {
                        submitNextChunk();
                    }
                });
            }

            $scope.confirmCb = function ()
            {
                $scope.createdUsers = [];

                submitNextChunk();
            };

            $scope.dataLoadedCb = function ()
            {
                if (!$scope.file.data) {
                    return false;
                }

                $scope.hasFile = true;
                $scope.disabled = false;

                var lines = $scope.file.data.split('\n');

                lines.forEach (function (line, index)
                {
                    if ($scope.settings.skipFirstLine && index === 0) {
                        return;
                    }

                    if (line.length == 0) {
                        return;
                    }

                    var tokens = line.split(';');

                    $scope.users.push ({fullname: tokens[0], email: tokens[1]});

                    $scope.disabled = false;
                });
            };

        }

        return {
            templateUrl: 'admin/add-multiple-users/add-multiple-users.tpl.html',
            restrict: 'E',
            scope: {
                controller: '=',
                onCancel: '&',
                onConfirm: '&'
            },
            controller: ['$scope', 'UserService', '$log', '$window', AddMultipleUsersController]
        }
    })

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


