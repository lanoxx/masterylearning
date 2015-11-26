'use strict';

angular.module('myApp.content', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('content', {
                url: '/content',
                views: {
                    'navigation@' :{
                        templateUrl: 'content/navigation.html'
                    },
                    '': {
                        templateUrl: 'content/content.html'
                    }
                }
            })
    }]);
