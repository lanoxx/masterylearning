angular.module ('common.config', [])

/**
     * This provider can be used to
     */
    .provider ('ApiConfig', [function ApiConfigProvider ()
    {
        "use strict";

        function getApiUrlFromConfig (config)
        {
            var api_protocol = config.protocol || '';
            var api_host = config.host || '';
            var api_port = config.port || '';
            var api_path = config.path || '';

            var result = "";
            if (api_host) {
                if (api_protocol) {
                    result += api_protocol;
                }
                result += api_host;
                if (api_port) {
                    result += ':' + api_port;
                }
            }
            result += '/';
            if (api_path) {
                result += api_path;
            } else {

            }
            return result;
        }

        function ApiConfig (config)
        {
            config = config || {};
            var api_protocol = config.protocol || '';
            var api_host = config.host || '';
            var api_port = config.port || '';
            var api_path = config.path || '';

            function getApiUrl ()
            {
                return getApiUrlFromConfig (config);
            }

            function getApiProtocol ()
            {
                return api_protocol;
            }

            function getApiHost ()
            {
                return api_host;
            }

            function getApiPort ()
            {
                return api_port;
            }

            function getApiPath ()
            {
                return api_path;
            }

            this.getApiProtocol = getApiProtocol;
            this.getApiHost = getApiHost;
            this.getApiPort = getApiPort;
            this.getApiPath = getApiPath;
            this.getApiUrl = getApiUrl;
        }

        this.getApiUrl = getApiUrlFromConfig;

        this.$get = function ()
        {
            return ApiConfig;
        }
    }]);
