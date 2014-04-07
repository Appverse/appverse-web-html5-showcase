'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// INTEGRATED REST CLIENT MODULE (AppREST)
////////////////////////////////////////////////////////////////////////////
// The Integrated REST module includes communication.
// It is based on Restangular.
// Params configuration are set in app-configuration file as constants.
//
// SERVICES CLIENT CONFIGURATION
// The common API includes configuration for one set of REST resources client (1 base URL).
// This is the most common approach in the most of projects.
// In order to build several sets of REST resources (several base URLs) you should
// create scoped configurations. Please, review the below snnipet:
/*
 var MyRestangular = Restangular.withConfig(function(RestangularConfigurer) {
 RestangularConfigurer.setDefaultHeaders({'X-Auth': 'My Name'})
 });

 MyRestangular.one('place', 12).get();
 */
// The MyRestangular object has scoped properties of the Restangular on with a different
// configuration.
////////////////////////////////////////////////////////////////////////////

angular.module('AppREST', ['restangular', 'AppCache', 'AppConfiguration'])

.run(['$log', 'Restangular', 'CacheFactory', 'Oauth_RequestWrapper', 'Oauth_AccessToken', 'REST_CONFIG', 'SECURITY_GENERAL',
    function ($log, Restangular, CacheFactory, Oauth_RequestWrapper, Oauth_AccessToken, REST_CONFIG, SECURITY_GENERAL) {
        
        Restangular.setBaseUrl(REST_CONFIG.BaseUrl);
        Restangular.setExtraFields(REST_CONFIG.ExtraFields);
        Restangular.setParentless(REST_CONFIG.Parentless);
        var transformer;
        for (var i = 0; i < REST_CONFIG.ElementTransformer.length; i++) {
            $log.debug('Adding transformer');
            transformer = REST_CONFIG.ElementTransformer[i];
            Restangular.addElementTransformer(transformer.route, transformer.transformer);
        }
        Restangular.setOnElemRestangularized(REST_CONFIG.OnElemRestangularized);
        Restangular.setResponseInterceptor(
            function (data, operation, what, url, response) {

                /*
                1-Caches response data or not according to configuration.
                 */
                var cache = CacheFactory.getHttpCache();

                if (cache) {
                    if (REST_CONFIG.NoCacheHttpMethods[operation] === true) {
                        cache.removeAll();
                    } else if (operation === 'put') {
                        cache.put(response.config.url, response.config.data);
                    }
                }

                /*
                 2-Retrieves bearer/oauth token from header.
                 */
                //var tokenInHeader = response.headers(SECURITY_GENERAL.tokenResponseHeaderName);
                var tokenInHeader = response.headers('X-XSRF-Cookie');
                $log.debug('X-XSRF-Cookie: ' + tokenInHeader);
                if(tokenInHeader){
                    
                    Oauth_AccessToken.setFromHeader(tokenInHeader);
                }

                return data;
            }
        );
        if (typeof REST_CONFIG.RequestInterceptor === 'function') {
            $log.debug('Setting RequestInterceptor');
            Restangular.setRequestInterceptor(REST_CONFIG.RequestInterceptor);
        }
        if (typeof REST_CONFIG.FullRequestInterceptor === 'function') {
            $log.debug('Setting FullRequestInterceptor');
            Restangular.setFullRequestInterceptor(REST_CONFIG.FullRequestInterceptor);
        }
        Restangular.setErrorInterceptor(REST_CONFIG.ErrorInterceptor);
        Restangular.setRestangularFields(REST_CONFIG.RestangularFields);
        Restangular.setMethodOverriders(REST_CONFIG.MethodOverriders);
        Restangular.setFullResponse(REST_CONFIG.FullResponse);
        //Restangular.setDefaultHeaders(REST_CONFIG.DefaultHeaders);
        Restangular.setRequestSuffix(REST_CONFIG.RequestSuffix);
        Restangular.setUseCannonicalId(REST_CONFIG.UseCannonicalId);
        Restangular.setEncodeIds(REST_CONFIG.EncodeIds);

        
        $log.info('AppREST run');
        
    }])
/*
 * Factory Name: 'RESTFactory'
 * This module provides basic quick standard access to a REST API.K
 */
.factory('RESTFactory', ['$log', 'Restangular', 'Oauth_RequestWrapper','REST_CONFIG', 'SECURITY_GENERAL',
    function ($log, Restangular, Oauth_RequestWrapper, REST_CONFIG, SECURITY_GENERAL) {

        if(SECURITY_GENERAL.securityEnabled){
            Restangular = Oauth_RequestWrapper.wrapRequest(Restangular);
        }else{
            Restangular.setDefaultHeaders(
                {
                    'Content-Type': REST_CONFIG.DefaultContentType
                });
        }
        
        
        ////////////////////////////////////////////////////////////////////////////////////
        // ADVICES ABOUT PROMISES
        //
        // 1-PROMISES
        // All Restangular requests return a Promise. Angular's templates
        // are able to handle Promises and they're able to show the promise
        // result in the HTML. So, if the promise isn't yet solved, it shows
        // nothing and once we get the data from the server, it's shown in the template.
        // If what we want to do is to edit the object you get and then do a put, in
        // that case, we cannot work with the promise, as we need to change values.
        // If that's the case, we need to assign the result of the promise to a $scope variable.
        // 2-HANDLING ERRORS
        // While the first param is te callback the second parameter is the error handler function.
        // 
        //  Restangular.all("accounts").getList().then(function() {
        //      console.log("All ok");
        //  }, function(response) {
        //      console.log("Error with status code", response.status);
        //  });
        // 2-HANDLING LISTS
        //The best option for doing CRUD operations with a list, is to actually use the "real" list, and not the promise.
        // It makes it easy to interact with it.
        ////////////////////////////////////////////////////////////////////////////////////

        var factory = {};

        /*
        @function
        @param path String with the item URL
        @description Returns a complete list from a REST resource.
        */
        factory.readObject = function (path) {
            return Restangular.one(path).get().$object;
        };

        /*
        @function
        @param path String with the item URL
        @description Returns a complete list from a REST resource.
        Use to get data to a scope var. For example:
            $scope.people = readList('people');
        Then, use the var in templates:
            <li ng-repeat="person in people">{{person.Name}}</li>
        */
        factory.readList = function (path) {
            return Restangular.all(path).getList().$object;
        };

        /*
        @function
        @param path String with the item URL
        @param data Key of the given item
        @description Returns a unique value.
        */
        factory.readListItem = function (path, key) {
            return Restangular.one(path, key).get().$object;
        };

        /*
        @function
        @param path String with the item URL
        @param data Array of key with keys of the given items
        @description Returns a list of values from the provided params.
        */
        factory.readListItems = function (path, keys) {
            return Restangular.several(path, keys).getList().$object;
        };

        /*
        @function
        @param path String with the item URL
        @param data Item data  to be posted
        @description Returns result code.
        */
        factory.createListItem = function (path, newData, callback) {
            Restangular.all(path).post(newData).then(callback,restErrorHandler);
        };

        /*
        @function
        @param path String with the item URL
        @param data Item data  to be posted
        @description Returns result code.
        */
        factory.updateObject = function (path, newData, callback) {
            Restangular.one(path).put(newData).then(callback, restErrorHandler);
        };

        /*
        @function
        @param path String with the item URL
        @param data Item data  to be deleted
        @description Deletes an item from a list.
        */
        factory.deleteListItem = function (path, key, callback) {
            // Use 'then' to resolve the promise.
            Restangular.one(path, key).get().then(function (item) {
                item.remove().then(callback, restErrorHandler);
            });
        };

        /**
        @function
        @param path String with the item URL
        @param data Item data  to be deleted
        @description Deletes an item from a list.
        */
        factory.deleteObject = function (path, callback) {
            // Use 'then' to resolve the promise.
            Restangular.one(path).delete().then(callback,restErrorHandler);
        };
        
        /**
        @function
        @param response Response to know its status
        @description Provides a handler for errors.
        */
        function restErrorHandler(response){
            $log.error("Error with status code", response.status);
        };
        

        return factory;
    }]);
