'use strict';

angular.module('myApp.lectures2', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('lectures2', {
            url: '/lectures2',
            views: {
                'navigation@': {
                    templateUrl: 'navigation.html',
                    controller: 'NavigationCtrl'
                },
                '' : {
                    templateUrl: 'lectures2/lectures2.html'
                }
            },
            controller: 'Lectures2Ctrl'
        })

            .state('lectures2.formalmethods', {
                url: '/formalmethods',
                templateUrl: 'lectures2/formalmethods.html'
            });
    }])

    .controller('Lectures2Ctrl', ['$state', '$rootScope', function ($state, $rootScope) {

    }]);

