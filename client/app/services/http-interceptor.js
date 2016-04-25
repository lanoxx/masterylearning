angular.module ('myapp.services.http', [])

    .factory ('ResponseInterceptor', ['$log', '$q', '$injector', '$rootScope',
        function ($log, $q, $injector, $rootScope)
        {
            var ResponseInterceptor = {
                responseError: function (error)
                               {
                                   if (error.status === 401) {
                                       $log.error ("[myapp.services.http] ResponseInterceptor: Access unauthorized, broadcasting logout signal.");
                                       $rootScope.$broadcast ('myapp.logout', "Access unauthorized");
                                   }

                                   return $q.reject (error);
                               }


            };

            return ResponseInterceptor;
        }]);
