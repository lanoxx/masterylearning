angular.module ('myApp.practice', ['ui.router'])

    .config (['$stateProvider', function ($stateProvider) {
        $stateProvider.state('practice', {
            url: '/practice',
            views: {
                'navigation@': {
                    templateUrl: 'practice/navigation.html'
                },
                '': {
                    templateUrl: 'practice/practice.html'
                }
            }
        })

            .state('practice.propositionallogic', {
                url: '/propositionallogic',
                templateUrl: 'practice/propositionallogic.html'
            })

            .state('practice.propositionallogic.unit1', {
                url: '/unit1',
                templateUrl: 'practice/unit1.html'
            });
    }]);
