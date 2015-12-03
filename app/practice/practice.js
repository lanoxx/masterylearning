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
                templateUrl: 'practice/unit1.html'
            })
            .state('practice.manage', {
                url: '/manage',
                templateUrl: 'practice/manage.html'
            });
    }]);
