angular.module ('myApp.practice', ['ui.router'])

    .config (['$stateProvider', function ($stateProvider) {
        $stateProvider.state('practice', {
            url: '/practice',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationCtrl'
                },
                '': {
                    templateUrl: 'practice/practice.html'
                }
            }
        })

            .state('practice.formalmethods', {
                url: '/formalmethods',
                templateUrl: 'practice/formalmethods.html'
            })
            .state('practice.formalmethods.propositionallogic', {
                url: '/propositionallogic',
                templateUrl: 'practice/propositionallogic.html'
            })

            .state('practice.formalmethods.propositionallogic.unit1', {
                url: '/unit1',
                templateUrl: 'practice/unit1.html',
                controller: 'Unit1Ctrl'
            })
            .state('practice.manage', {
                url: '/manage',
                templateUrl: 'practice/manage.html'
            });
    }])

    .controller('Unit1Ctrl', ['$scope', '$uibModal', function ($scope, $uibModal) {
        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'practice/unit1modal.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }])

    .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
});
