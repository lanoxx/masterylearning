angular.module('myApp.topics.proplogic', ['ui.router'])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('topics.proplogic', {
            url: '/propositionalLogic',
            templateUrl: 'topics/proplogic/propositionallogic.html',
            controller: 'PropLogicCtrl'
        })
    }])

    .controller('PropLogicCtrl', ['$state', function ($state) {

    }]);
