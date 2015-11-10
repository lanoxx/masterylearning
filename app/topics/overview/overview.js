angular.module('myApp.topics.overview', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('topics.overview', {
            url: '/overview',
            templateUrl: 'topics/overview/overview.html'
        })
    }]);
