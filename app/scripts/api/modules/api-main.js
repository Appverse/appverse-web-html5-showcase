'use strict';
  
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// COMMON API - MAIN
// The Main module includes other API modules:
// - RESTIntegrated
// - CacheService
// - Detection
// - ServerPush
// - Security
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////

//angular.module('COMMONAPI', ['RESTIntegrated','CacheService', 'Detection', 'ServerPush', 'Security' ])
angular.module('COMMONAPI', ['AppREST', 'AppCache', 'AppConfiguration', 'AppTranslate'])
    .config(['$rootScope', 'CacheFactory', 'RESTFactory', 'CACHE_SERVICE',
      function ($rootScope, CacheFactory, RESTFactory, CACHE_SERVICE) {
          /*
           CACHE MODULE
           Initializes the different caches with params in configuration.
           */
          CacheFactory.setDefaultHttpCacheStorage(
              CACHE_SERVICE.ScopeCache_duration,
              CACHE_SERVICE.ScopeCache_capacity
          );

          CacheFactory.setBrowserStorage(
              CACHE_SERVICE.BrowserStorage_type
          );

          CacheFactory.setDefaultHttpCacheStorage(
              CACHE_SERVICE.HttpCache_duration,
              CACHE_SERVICE.HttpCache_capacity)
          ;

          CacheFactory.setIndexedDBStorage(
              CACHE_SERVICE.IndexedDB_objectStore,
              CACHE_SERVICE.IndexedDB_keyPath,
              CACHE_SERVICE.IndexedDB_mainIndex,
              CACHE_SERVICE.IndexedDB_mainIndex_isUnique,
              CACHE_SERVICE.IndexedDB_secondaryIndex,
              CACHE_SERVICE.IndexedDB_secondaryIndex_isUnique
          );

      }]);