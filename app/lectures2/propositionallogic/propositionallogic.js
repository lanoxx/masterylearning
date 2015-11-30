'use strict';

angular.module('myApp.lectures2.propositionallogic', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {
        $stateProvider.state('lectures2.formalmethods.propositionallogic', {
                url: '/propositionallogic',
                templateUrl: 'lectures2/propositionallogic/propositionallogic.html',
                controller: 'PropositionallogicCtrl'
            })
    }])

    .controller('PropositionallogicCtrl', ['$state', '$rootScope', function ($state, $rootScope) {

    }]);

