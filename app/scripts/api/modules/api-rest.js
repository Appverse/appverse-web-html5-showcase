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

angular.module('AppREST', [
    'restangular',
    'AppCache',
    'AppConfiguration'])
    .config(['RestangularProvider', 'REST_CONFIG',
      function (RestangularProvider, REST_CONFIG) {

          /*
          The cache for http calls
           */
          setDefaultHttpCacheStorage();

          /*
          The base URL for all calls to the main backend.
          Only one main base URL is allowed for now.
          */
          RestangularProvider.setBaseUrl(REST_CONFIG.BaseUrl);
          //These are the fields that you want to save from your parent resources if you need to display them.
          RestangularProvider.setExtraFields();
          /* 
          Use this property to control whether Restangularized elements to have a parent or not.
          This method accepts 2 parameters:
            Boolean: Specifies if all elements should be parentless or not
            Array: Specifies the routes (types) of all elements that should be parentless. For example ['buildings']
          */
          RestangularProvider.setParentless();
          /*
          $http from AngularJS can receive a bunch of parameters like cache, transformRequest and so on. 
          You can set all of those properties in the object sent on this setter so that they will be used 
          in EVERY API call made by Restangular. This is very useful for caching for example. 
          All properties that can be set can be checked here: 
          http://docs.angularjs.org/api/ng.$http#parameters
          */
          RestangularProvider.setDefaultHttpFields(REST_CONFIG.DefaultHttpFields);
          RestangularProvider.addElementTransformer();
          RestangularProvider.setOnElemRestangularized();
          RestangularProvider.setResponseInterceptor (
              /*
              Invalidate http cache for editing methods
               */
              function(response){
                  for (var operation in REST_CONFIG.NoCacheHttpMethods) {
                      if (operation === true) {
                          cache.removeAll();
                      }
                  }
              }
          );
          RestangularProvider.setRequestInterceptor();
          RestangularProvider.setFullRequestInterceptor();
          RestangularProvider.setErrorInterceptor();
          RestangularProvider.setRestangularFields();
          RestangularProvider.setMethodOverriders();
          RestangularProvider.setDefaultRequestParams();
          RestangularProvider.setFullResponse();
          RestangularProvider.setDefaultHeaders();
          RestangularProvider.setRequestSuffix();
          RestangularProvider.setUseCannonicalId();
          RestangularProvider.setEncodeIds();

      }])
   /*
    * Factory Name: 'RESTConnect'
    * Contains methods for data finding (demo).
    * This module provides basic quick standard access to a REST API.
    * For a more flexible 
    *
    * findById: Util for finding an object by its 'id' property among an array
    * newRandomKey: Util for returning a randomKey from a collection that also isn't the current key
    */
    .factory('RESTFactory',['$log', 'Restangular',
      function ($log, Restangular) {
          
          ////////////////////////////////////////////////////////////////////////////////////
          // ADVICE ABOUT PROMISES
          // All Restangular requests return a Promise. Angular's templates 
          // are able to handle Promises and they're able to show the promise 
          // result in the HTML. So, if the promise isn't yet solved, it shows 
          // nothing and once we get the data from the server, it's shown in the template. 
          // If what we want to do is to edit the object you get and then do a put, in 
          // that case, we cannot work with the promise, as we need to change values. 
          // If that's the case, we need to assign the result of the promise to a $scope variable.
          ////////////////////////////////////////////////////////////////////////////////////



          var factory = {};
          
                /*
                @function
                @param path String with the item URL
                @description Returns a complete list from a REST resource.
                Use to get data to a scope var. For example:
                    $scope.people = rest_getAll('people');
                Then, use the var in templates:
                    <li ng-repeat="person in people">{{person.Name}}</li>
                */
          factory.rest_getAll = function (path) {
                        Restangular.all(path).getList().then(function(data) {
                            return data;
                        })
          };
          
                /*
                @function
                @param path String with the item URL
                @param data Key of the given item
                @description Returns a unique value.
                */
           factory.rest_getItem = function (path, key) {
                       Restangular.one(path, key).get().then(function(data) {
                                return data;
                       })
           };
          
                /*
                @function
                @param path String with the item URL
                @param data Array of key with keys of the given items
                @description Returns a list of values from the provided params.
                */
           factory.rest_getItems = function (path, keys) {
                       Restangular.several(path, keys).getList().then(function(data) {
                                return data;
                       })
           };
                              
          /*
           @function
           @param path String with the item URL
           @param data Item data  to be posted
           @description Returns result code.
           */
          factory.rest_postItem = function (path, newData) {
              this.rest_getAll(path).post(newData);
          };

          /*
           @function
           @param path String with the item URL
           @param data Item data  to be deleted
           @description Returns result code.
           */
          factory.rest_deleteItem = function (path, key) {
              var item = this.rest_getItem(path, key);
              item.remove();
          };


         return factory;
          
    }]);