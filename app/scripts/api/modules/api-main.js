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
angular.module('COMMONAPI', ['AppLogging', 'AppREST', 'AppCache', 'AppConfiguration', 'AppTranslate', 'AppServerPush'])
    .config(['$rootScope', 'CacheFactory', 'RESTFactory', 'CACHE_CONFIG',
      function ($rootScope, CacheFactory, RESTFactory, CACHE_CONFIG) {
          /*
           CACHE MODULE
           Initializes the different caches with params in configuration.
           */
          if(CACHE_SERVICE.ScopeCache_Enabled){
              CacheFactory.setScopeCache(
                  CACHE_SERVICE.ScopeCache_duration,
                  CACHE_SERVICE.ScopeCache_capacity
              );
          }

          if(CACHE_SERVICE.BrowserStorageCache_Enabled){
              CacheFactory.setBrowserStorage(
                  CACHE_SERVICE.BrowserStorage_type
              );
          }

          if(CACHE_SERVICE.HttpCache_Enabled){
              CacheFactory.setDefaultHttpCacheStorage(
                  CACHE_SERVICE.HttpCache_duration,
                  CACHE_SERVICE.HttpCache_capacity)
              ;
          }

          if(CACHE_SERVICE.IndexedDBCache_Enabled){
              CacheFactory.setIndexedDBStorage(
                  CACHE_SERVICE.IndexedDB_objectStore,
                  CACHE_SERVICE.IndexedDB_keyPath,
                  CACHE_SERVICE.IndexedDB_mainIndex,
                  CACHE_SERVICE.IndexedDB_mainIndex_isUnique,
                  CACHE_SERVICE.IndexedDB_secondaryIndex,
                  CACHE_SERVICE.IndexedDB_secondaryIndex_isUnique
              );
          }


      }]);