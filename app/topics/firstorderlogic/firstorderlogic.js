angular.module ('myApp.topics.firstorderlogic', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state ('topics.firstorderlogic', {
            url: '/firstorderlogic',
            templateUrl: 'topics/firstorderlogic/firstorderlogic.html'
        })
    }]);
