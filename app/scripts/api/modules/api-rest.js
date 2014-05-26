'use strict';

/**
 * @ngdoc module
 * @name AppREST
 * @description
 *
 * The Integrated REST module includes communication.
 *
 * It is based on Restangular.
 *
 * Params configuration are set in app-configuration file as constants.
 *
 * SERVICES CLIENT CONFIGURATION
 *
 * The common API includes configuration for one set of REST resources client (1 base URL).
 * This is the most common approach in the most of projects.
 * In order to build several sets of REST resources (several base URLs) you should
 * create scoped configurations. Please, review the below snippet:
 *
 * var MyRestangular = Restangular.withConfig(function(RestangularConfigurer) {
 * RestangularConfigurer.setDefaultHeaders({'X-Auth': 'My Name'})
 * });
 *
 * MyRestangular.one('place', 12).get();
 *
 * The MyRestangular object has scoped properties of the Restangular on with a different
 * configuration.
 */

angular.module('AppREST', ['restangular', 'AppCache', 'AppConfiguration'])

.run(['$log', 'Restangular', 'CacheFactory', 'REST_CONFIG',
    function ($log, Restangular, CacheFactory, REST_CONFIG) {

        $log.info('AppREST run');

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

                var cache = CacheFactory.getHttpCache();

                if (cache) {
                    if (REST_CONFIG.NoCacheHttpMethods[operation] === true) {
                        cache.removeAll();
                    } else if (operation === 'put') {
                        cache.put(response.config.url, response.config.data);
                    }
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
        Restangular.setDefaultRequestParams(REST_CONFIG.DefaultRequestParams);
        Restangular.setFullResponse(REST_CONFIG.FullResponse);
        Restangular.setDefaultHeaders(REST_CONFIG.DefaultHeaders);
        Restangular.setRequestSuffix(REST_CONFIG.RequestSuffix);
        Restangular.setUseCannonicalId(REST_CONFIG.UseCannonicalId);
        Restangular.setEncodeIds(REST_CONFIG.EncodeIds);
    }])

/**
 * @ngdoc service
 * @name AppREST.factory:RESTFactory
 * @requires $log
 * @requires Restangular
 * @description
 * Contains methods for data finding (demo).
 * This module provides basic quick standard access to a REST API.
 */
.factory('RESTFactory', ['$log', 'Restangular',
    function ($log, Restangular) {

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
        // 2-HANDLING LISTS
        //The best option for doing CRUD operations with a list, is to actually use the "real" list, and not the promise.
        // It makes it easy to interact with it.
        ////////////////////////////////////////////////////////////////////////////////////

        var factory = {};

        /**
         * @ngdoc method
         * @name AppREST.factory:RESTFactory#readObject
         * @methodOf AppREST.factory:RESTFactory
         * @param {String} path The item URL
         * @description Returns a complete list from a REST resource.
         * @returns {object} List of values
         */
        factory.readObject = function (path) {
            return Restangular.one(path).get().$object;
        };

        /*
         * Returns a complete list from a REST resource.
            Use to get data to a scope var. For example:
            $scope.people = readList('people');
            Then, use the var in templates:
            <li ng-repeat="person in people">{{person.Name}}</li>
         */
       /**
         * @ngdoc method
         * @name AppREST.factory:RESTFactory#readList
         * @methodOf AppREST.factory:RESTFactory
         * @param {String} path The item URL
         * @description Returns a complete list from a REST resource.
         * @returns {object} List of values
         */
        factory.readList = function (path) {
            return Restangular.all(path).getList().$object;
        };

       /**
         * @ngdoc method
         * @name AppREST.factory:RESTFactory#readListItem
         * @methodOf AppREST.factory:RESTFactory
         * @param {String} path The item URL
         * @param {String} key The item key
         * @description Returns a unique value.
         * @returns {object} An item value
         */
        factory.readListItem = function (path, key) {
            return Restangular.one(path, key).get().$object;
        };


        /**
         * @ngdoc method
         * @name AppREST.factory:RESTFactory#readListItems
         * @methodOf AppREST.factory:RESTFactory
         * @param {String} path The item URL
         * @param {String} keys The item keys array
         * @description Returns a unique value.
         * @returns {object} List of values
         */
        factory.readListItems = function (path, keys) {
            return Restangular.several(path, keys).getList().$object;
        };


       /**
         * @ngdoc method
         * @name AppREST.factory:RESTFactory#createListItem
         * @methodOf AppREST.factory:RESTFactory
         * @param {String} path The item URL
         * @param {object} newData The item to be created
         * @param {object} callback The function for callbacking
         * @description Returns result code.
         * @returns {object} The created item
         */
        factory.createListItem = function (path, newData, callback) {
            Restangular.all(path).post(newData).then(callback);
        };


        /**
         * @ngdoc method
         * @name AppREST.factory:RESTFactory#updateObject
         * @methodOf AppREST.factory:RESTFactory
         * @param {String} path The item URL
         * @param {object} newData The item to be updated
         * @param {object} callback The function for callbacking
         * @description Returns result code.
         * @returns {object} The updated item
         */
        factory.updateObject = function (path, newData, callback) {
            Restangular.one(path).put(newData).then(callback);
        };


        /**
         * @ngdoc method
         * @name AppREST.factory:RESTFactory#deleteListItem
         * @methodOf AppREST.factory:RESTFactory
         * @param {String} path The item URL
         * @param {object} key The item key to be deleted
         * @param {object} callback The function for callbacking
         * @description Deletes an item from a list.
         * @returns {object} The deleted item
         */
        factory.deleteListItem = function (path, key, callback) {
            // Use 'then' to resolve the promise.
            Restangular.one(path, key).get().then(function (item) {
                item.remove().then(callback);
            });
        };


       /**
         * @ngdoc method
         * @name AppREST.factory:RESTFactory#deleteObject
         * @methodOf AppREST.factory:RESTFactory
         * @param {String} path The item URL
         * @param {object} callback The function for callbacking
         * @description Deletes an item from a list.
         * @returns {object} The deleted item
         */
        factory.deleteObject = function (path, callback) {
            // Use 'then' to resolve the promise.
            Restangular.one(path)['delete']().then(callback);
        };

        return factory;
    }]);
