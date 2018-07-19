angular.module ('myapp.config', ['common.config'])
    /**
     * This is our production configuration
     */
    .provider ('Configuration', ['ApiConfigProvider', function ConfigurationProvider (ApiConfigProvider)
    {
        "use strict";
        var $log =  angular.injector(['ng']).get('$log');

        $log.info ("[myApp.config] ConfigurationProvider: configured for production environment.");

        var config = {
            path: 'api'
        };

        $log.info ("[myApp.config] ConfigurationProvider: configured to access rest API at: " + ApiConfigProvider.getApiUrl(config));

        this.$get = ['ApiConfig', function (ApiConfig)
        {
            return new ApiConfig (config);
        }]
    }]);
