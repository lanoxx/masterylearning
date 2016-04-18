angular.module ('myapp.config', ['common.config'])
    /**
     * This is our developer configuration
     */
    .provider ('Configuration', ['ApiConfigProvider', function ConfigurationProvider (ApiConfigProvider)
    {
        "use strict";
        var $log =  angular.injector(['ng']).get('$log');

        $log.info ("[myApp.config] ConfigurationProvider: configured for development environment.");

        var config = {
            protocol: 'http://',
            host:     'localhost',
            port:     '8080',
            path:     ''
        };

        $log.info ("[myApp.config] ConfigurationProvider: configured to access rest API at: " + ApiConfigProvider.getApiUrl(config));

        this.$get = ['ApiConfig', function (ApiConfig)
        {
            return new ApiConfig (config);
        }]
    }]);
