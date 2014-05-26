'use strict';

/**
 * @ngdoc module
 * @name AppCache
 * @requires AppConfiguration
 * @description
 * The Cache module includes several types of cache.
 *
 * Scope Cache: To be used in a limited scope. It does not persist when navigation.
 *
 * Browser Storage: It handles short strings into local or session storage. Access is synchronous.
 *
 * IndexedDB: It initializes indexed database at browser to handle data structures. Access is asynchronous.
 *
 * Http Cache: It initializes cache for the $httpProvider. $http service instances will use this cache.
 *
 * WARNING - HTTP Service Cache:
 *
 * The rest module handles its own cache. So, HttpCache affects only to manually created $http objects.
 *
 * WARNING - IndexedDB Usage:
 *
 * IndexedDB works both online and offline, allowing for client-side storage of large amounts of structured data, in-order key retrieval, searches over the values stored, and the option to store multiple values per key.
 *
 * With IndexedDB, all calls are asynchronous and all interactions happen within a transaction.
 *
 * Consider Same-origin policy constraints when accessing the IDB. This module creates a standard default IDB for the application domain.
 *
 * In order to make easiest as possible usage of the API two methods have been defined. The below example shows how to use these object to build custom queries to the IDB considering the initialization parameters:
 * <pre>
 *  function (param){
 *      var queryBuilder = CacheFactory.getIDBQueryBuilder();
 *      var objStore = CacheFactory.getIDBObjectStore();
 *      var myQuery = queryBuilder.$index(CACHE_CONFIG.IndexedDB_mainIndex).$gt(param).$asc.compile;
 *      objStore.each(myQuery).then(function(cursor){
 *          $scope.key = cursor.key;
 *          $scope.value = cursor.value;
 *      });
 *  }
 * </pre>
 */

angular.module('AppCache', ['ng', 'AppConfiguration', 'jmdobry.angular-cache', 'ngResource'])

.run(['$log', 'CacheFactory', 'CACHE_CONFIG', 'IDB',
    function ($log, CacheFactory, CACHE_CONFIG, IDB) {

        $log.info('AppCache run');

        /* Initializes the different caches with params in configuration. */
        if (CACHE_CONFIG.ScopeCache_Enabled) {
            CacheFactory.setScopeCache(
                CACHE_CONFIG.ScopeCache_duration,
                CACHE_CONFIG.ScopeCache_capacity
            );
        }

        if (CACHE_CONFIG.BrowserStorageCache_Enabled) {
            CacheFactory.setBrowserStorage(
                CACHE_CONFIG.BrowserStorage_type,
                CACHE_CONFIG.MaxAge,
                CACHE_CONFIG.CacheFlushInterval,
                CACHE_CONFIG.DeleteOnExpire,
                CACHE_CONFIG.VerifyIntegrity
            );
        }

        /* The cache for http calls */
        if (CACHE_CONFIG.HttpCache_Enabled) {
            CacheFactory.setDefaultHttpCacheStorage(
                CACHE_CONFIG.HttpCache_duration,
                CACHE_CONFIG.HttpCache_capacity);
        }

        /* IndexedDB */
        if (CACHE_CONFIG.IndexedDBCache_Enabled) {
            IDB.openDB(
                CACHE_CONFIG.IndexedDB_name,
                CACHE_CONFIG.IndexedDB_version,
                CACHE_CONFIG.IndexedDB_options);
        }
    }])

/**
 * @ngdoc service
 * @name AppCache.service:CacheFactory
 * @requires $angularCacheFactory
 * @requires $http
 * @requires CACHE_CONFIG
 * @description
 * Contains methods for cache management.
 */
.factory('CacheFactory', ['$angularCacheFactory', '$http', 'CACHE_CONFIG', '$log', 'IDB',
    function ($angularCacheFactory, $http, CACHE_CONFIG, $log, IDB) {

        var factory = {
            _scopeCache: null,
            _browserCache: null,
            _httpCache: null
        };

        /**
         * @ngdoc method
         * @name AppCache.service:CacheFactory#setScopeCache
         * @methodOf AppCache.service:CacheFactory
         * @param {number} duration Items expire after this time.
         * @param {number} capacity Turns the cache into LRU (Least Recently Used) cache. If you don't want $http's default cache to store every response.
         * @description Configure the scope cache.
         */
        factory.setScopeCache = function (duration, capacity) {
            factory._scopeCache = $angularCacheFactory(CACHE_CONFIG.DefaultScopeCacheName, {
                maxAge: duration,
                capacity: capacity
            });
            return factory._scopeCache;
        };

        /**
         * @ngdoc method
         * @name AppCache.service:CacheFactory#getScopeCache
         * @methodOf AppCache.service:CacheFactory
         * @description getScopeCache is the singleton that CacheFactory manages as a local cache created with $angularCacheFactory, which is what we return from the service. Then, we can inject this into any controller we want and it will always return the same values.
         *
         * The newly created cache object has the following set of methods:
         *
         * {object} info() — Returns id, size, and options of cache.
         *
         * {{*}} put({string} key, {*} value) — Puts a new key-value pair into the cache and returns it.
         *
         * {{*}} get({string} key) — Returns cached value for key or undefined for cache miss.
         *
         * {void} remove({string} key) — Removes a key-value pair from the cache.
         *
         * {void} removeAll() — Removes all cached values.
         *
         * {void} destroy() — Removes references to this cache from $angularCacheFactory.
         */
        factory.getScopeCache = function () {
            return factory._scopeCache || factory.setScopeCache(CACHE_CONFIG.ScopeCache_duration,
                CACHE_CONFIG.ScopeCache_capacity);
        };

        /**
         * @ngdoc method
         * @name AppCache.service:CacheFactory#setBrowserStorage
         * @methodOf AppCache.service:CacheFactory
         * @param {number} type Type of storage ( 1 local | 2 session).
         * @param {number} maxAgeInit .
         * @param {number} cacheFlushIntervalInit .
         * @param {boolean} deleteOnExpireInit .
         *
         * @description
         * This object makes Web Storage working in the Angular Way.
         *
         * By default, web storage allows you 5-10MB of space to work with, and your data is stored locally on the device rather than passed back-and-forth with each request to the server.
         * Web storage is useful for storing small amounts of key/value data and preserving functionality online and offline.
         *
         * With web storage, both the keys and values are stored as strings.
         *
         * We can store anything except those not supported by JSON:
         *
         * Infinity, NaN - Will be replaced with null.
         *
         * undefined, Function - Will be removed.
         *
         * The returned object supports the following set of methods:
         * {void} $reset() - Clears the Storage in one go.
         */
        factory.setBrowserStorage = function (type, maxAgeInit, cacheFlushIntervalInit, deleteOnExpireInit, verifyIntegrityInit) {

            var browserStorageType = CACHE_CONFIG.SessionBrowserStorage;

            factory._browserCache = $angularCacheFactory(CACHE_CONFIG.DefaultBrowserCacheName, {
                maxAge: maxAgeInit,
                cacheFlushInterval: cacheFlushIntervalInit,
                deleteOnExpire: deleteOnExpireInit,
                storageMode: browserStorageType,
                verifyIntegrity: verifyIntegrityInit
            });

            return factory._browserCache;
        };


        /**
         * @ngdoc method
         * @name AppCache.service:CacheFactory#setDefaultHttpCacheStorage
         * @methodOf AppCache.service:CacheFactory
         * @param {number} duration items expire after this time.
         * @param {string} capacity  turns the cache into LRU (Least Recently Used) cache.
         * @description Default cache configuration for $http service
         */
        factory.setDefaultHttpCacheStorage = function (maxAge, capacity) {

            var cacheId = 'MyHttpAngularCache';
            factory._httpCache = $angularCacheFactory.get(cacheId);

            if (!factory._httpCache) {
                factory._httpCache = $angularCacheFactory(cacheId, {
                    // This cache can hold x items
                    capacity: capacity,

                    // Items added to this cache expire after x milliseconds
                    maxAge: maxAge,

                    // Items will be actively deleted when they expire
                    deleteOnExpire: 'aggressive',

                    // This cache will check for expired items every x milliseconds
                    recycleFreq: 15000,

                    // This cache will clear itself every x milliseconds
                    cacheFlushInterval: 15000,

                    // This cache will sync itself with localStorage
                    //                        storageMode: 'localStorage',

                    // Custom implementation of localStorage
                    //storageImpl: myLocalStoragePolyfill,

                    // Full synchronization with localStorage on every operation
                    verifyIntegrity: true
                });
            } else {
                factory._httpCache.setOptions({
                    // This cache can hold x items
                    capacity: capacity,

                    // Items added to this cache expire after x milliseconds
                    maxAge: maxAge,

                    // Items will be actively deleted when they expire
                    deleteOnExpire: 'aggressive',

                    // This cache will check for expired items every x milliseconds
                    recycleFreq: 15000,

                    // This cache will clear itself every x milliseconds
                    cacheFlushInterval: 15000,

                    // This cache will sync itself with localStorage
                    storageMode: 'localStorage',

                    // Custom implementation of localStorage
                    //storageImpl: myLocalStoragePolyfill,

                    // Full synchronization with localStorage on every operation
                    verifyIntegrity: true
                });
            }
            $http.defaults.cache = factory._httpCache;
            return factory._httpCache;
        };

        /**
         * @ngdoc method
         * @name AppCache.service:CacheFactory#getHttpCache
         * @methodOf AppCache.service:CacheFactory
         * @description Returns the httpcache object in factory
         * @returns httpcache object
         */
        factory.getHttpCache = function () {
            return factory._httpCache;
        };

        return factory;
    }
])


/**
 * @ngdoc service
 * @name AppCache.service:IDB
 * @description
 * This service has been planned to be used as HTML5's indexedDB specification with the commonAPI.
 *
 * Normally, and as a recommendation, we should have only one indexedDB per app.
 * <pre>
 * options = {
 *   storeName : 'your store name',
 *   keyPath : 'inline key',
 *   indexes : [{ name : 'indexName', unique : 'true/false' },{},...]
 * }
 * </pre>
 * Unify browser specific implementations:
 * <pre>
 * var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 * var IDBKeyRange = window.IDBKeyRange || window.mozIDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
 * </pre>
 */
.service('IDB', ['$rootScope', '$log',
    function ($rootScope, $log) {
        var self = this;
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        var IDBKeyRange = window.IDBKeyRange || window.mozIDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#openDB
         * @methodOf AppCache.service:IDB
         * @function
         * @param {string} dbName .
         * @param {int} version .
         * @param {array} options .
         * @description Initializes an IndexedDB on the browser
         */
        this.openDB = function (dbName, version, options) {

            if (!indexedDB) {
                return;
            }

            this.dbName = dbName;
            this.version = version;
            this.db = null;
            this.objectStore = null;
            this.options = {};
            if (options instanceof Array) {
                for (var i = 0; i < options.length; i++) {
                    this.options[options[i].storeName] = options[i];
                }
            } else {
                this.options[options.storeName] = options;
            }
            $log.debug('options', this.options);

            var request;
            // The version value is important to work on most of browsers.
            if (!!this.version) {
                request = indexedDB.open(this.dbName, this.version);
            } else {
                request = indexedDB.open(this.dbName);
            }
            // handle the failure case
            request.onerror = function (event) {
                $log.debug('failed to open db ' + event);
                self.failure();
            };
            // handle the upgrade case
            request.onupgradeneeded = function (event) {
                $log.debug('idb upgrade');
                var db = event.target.result;
                this.db = db;
                var opKeys = Object.keys(this.options);
                // Step through the options objects.
                // The db needs to know about all keys and indexes in a store
                for (var i = 0; i < opKeys.length; i++) {
                    var options = this.options[opKeys[i]];
                    var objectStore;

                    if (!this.db.objectStoreNames.contains(options.storeName)) {
                        if (!!options.keyPath) {
                            objectStore = db.createObjectStore(options.storeName, {
                                keyPath: options.keyPath
                            });
                        } else {
                            objectStore = db.createObjectStore(options.storeName);
                        }
                    } else {
                        objectStore = event.currentTarget.transaction.objectStore(options.storeName);
                    }
                    if (!!options.indexes) {
                        for (var j = 0; j < options.indexes.length; j++) {
                            var indexName = options.indexes[j].name;
                            var indexData = options.indexes[j];

                            if (objectStore.indexNames.contains(indexName)) {
                                // check if it complies
                                var actualIndex = objectStore.index(indexName);
                                var complies = indexComplies(actualIndex, indexData);
                                if (!complies) {
                                    objectStore.deleteIndex(indexName);
                                    objectStore.createIndex(indexName, indexName, {
                                        unique: indexData.unique
                                    });
                                }
                            } else {
                                objectStore.createIndex(indexName, indexName, {
                                    unique: indexData.unique
                                });
                            }
                        }
                    }
                }
                $rootScope.$emit('dbopenupgrade', [this.dbName, event.target.transaction]);
            }.bind(this);

            request.onsuccess = function (event) {
                this.db = event.target.result;
                $log.debug('idb success', this, this.db);
                // $rootScope.$emit is AngularJS's event emitter
                $rootScope.$emit('dbopen', [this.dbName]);
            }.bind(this);

        };

        this.failure = function () {
            $rootScope.$emit('failure');
        };
        this.success = function () {
            $rootScope.$emit('success');
        };
        this.test = function () {
            $log.debug('idb test');
        };

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#indexComplies
         * @methodOf AppCache.service:IDB
         * @param {string} actual Real index.
         * @param {string} expected Expected index.
         * @description Checks if the indexes complaint
         * @returns {boolean} True if both indexes are equal
         */
        function indexComplies(actual, expected) {
            return ['keyPath', 'unique', 'multiEntry'].every(function (key) {
                // IE10 returns undefined for no multiEntry
                if (key === 'multiEntry' && actual[key] === undefined && expected[key] === false) {
                    return true;
                }
                return expected[key] === actual[key];
            });
        }
        /**
         * @ngdoc method
         * @name AppCache.service:IDB#getTransactionStore
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @param {string} mode Current mode of the idb.
         * @description A quick and simple wrapper for getting the transaction store with an optional mode
         * @returns {object} The object store
         */
        this.getTransactionStore = function (storeName, mode) {
            if (!(this.db instanceof IDBDatabase)) {
                $log.debug('db', this, this.db);
                throw 'missing database error!';
            }

            if (typeof mode !== 'string') {
                return this.db.transaction(storeName).objectStore(storeName);
            } else {
                return this.db.transaction(storeName, mode).objectStore(storeName);
            }
        };

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#getItemOnIndex
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @param {string} index The index of the search.
         * @param {string} key The key of the item.
         * @description Retrieves one item of the idb from its key and a given index
         */
        this.getItemOnIndex = function (storeName, index, key) {
            var boundKeyRange = IDBKeyRange.only(key);

            var cursorRequest = this.getTransactionStore(storeName)
                .index(index).openCursor(boundKeyRange);

            cursorRequest.onsuccess = function (event) {
                var cursor = cursorRequest.result || event.result;
                if (cursor) {
                    $rootScope.$emit('getitem', [self.dbName, storeName, cursor.value]);
                } else {
                    $log.debug('no cursor');
                    self.failure();
                }
            };
            cursorRequest.onerror = self.failure;
        };

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#getItemsOnIndex
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @param {string} index The index of the search.
         * @param {string} key The key of the item.
         * @description Retrieves a list of items of the idb from their key and a given index
         */
        this.getItemsOnIndex = function (storeName, index, key) {
            var boundKeyRange = IDBKeyRange.only(key);

            var cursorRequest = this.getTransactionStore(storeName)
                .index(index).openCursor(boundKeyRange, "next");

            var results = [];

            cursorRequest.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor['continue']();
                } else {
                    $rootScope.$emit('getitem', [self.dbName, storeName, results]);
                }
            };
            cursorRequest.onerror = self.failure;
        };

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#getItemsOnIndexWithTransaction
         * @methodOf AppCache.service:IDB
         * @param {object} transaction The transaction operation of the object.
         * @param {string} storeName The asssigned name of the store object.
         * @param {string} index The index of the search.
         * @param {string} key The key of the item.
         * @description Retrieves a list of items of the idb from their key and a given index
         */
        this.getItemsOnIndexWithTransaction = function (transaction, storeName, index, key) {
            var boundKeyRange = IDBKeyRange.only(key);

            var cursorRequest = transaction.objectStore(storeName)
                .index(index).openCursor(boundKeyRange, "next");

            var results = [];

            cursorRequest.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor['continue']();
                } else {
                    $rootScope.$emit('getitem', [self.dbName, storeName, results]);
                }
            };
            cursorRequest.onerror = self.failure;
        };

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#getItem
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @param {string} key The key of the item.
         * @description Retrieves one item for simple get requests by key
         */
        this.getItem = function (storeName, key) {
            var getRequest = this.getTransactionStore(storeName).get(key);

            getRequest.onsuccess = function (event) {
                $rootScope.$emit('getitem', [self.dbName, storeName, event.target.result]);
            };
            getRequest.onerror = self.failure;
        };


        /**
         * @ngdoc method
         * @name AppCache.service:IDB#getInit
         * @methodOf AppCache.service:IDB
         * @param {object} transaction The transaction operation of the object.
         * @param {string} storeName The asssigned name of the store object.
         * @description Just going to get everything from a given data store
         */
        this.getInit = function (transaction, storeName) {
            var objectStore = transaction.objectStore(storeName);
            var results = [];

            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor['continue']();
                } else {
                    $rootScope.$emit('getinit', [self.dbName, storeName, results]);
                }
            };
            objectStore.onerror = self.failure;
        };


        /**
         * @ngdoc method
         * @name AppCache.service:IDB#getAll
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @description Similar to getInit, but we don't have a transaction to pass in
         */
        this.getAll = function (storeName) {
            var objectStore = this.getTransactionStore(storeName);
            var results = [];

            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor['continue']();
                } else {
                    $rootScope.$emit('getall', [self.dbName, storeName, results]);
                }
            };
            objectStore.onerror = self.failure;
        };

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#remove
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @param {string} key The key of the object
         * @description Removes an item from its key
         */
        this.remove = function (storeName, key) {
            var request = this.getTransactionStore(storeName, "readwrite")['delete'](key);
            request.onsuccess = function () {
                $rootScope.$emit('remove', [self.dbName, storeName]);
            };
            request.onerror = self.failure;
        };

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#removeItemsOnIndex
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @param {string} index The provided index
         * @param {string} key
         * @param {string} key_path
         * @description Remove a set of items from key path
         */
        this.removeItemsOnIndex = function (storeName, index, key, key_path) {
            var boundKeyRange = IDBKeyRange.only(key);

            var transactionStore = this.getTransactionStore(storeName, "readwrite");
            var cursorRequest = transactionStore.index(index).openCursor(boundKeyRange, "next");

            cursorRequest.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var request = transactionStore['delete'](cursor.value[key_path]);
                    request.onsuccess = self.success;
                    request.onerror = self.failure;

                    cursor['continue']();
                } else {
                    $rootScope.$emit('remove', [self.dbName, storeName]);
                }
            }.bind(transactionStore);
            cursorRequest.onerror = self.failure;
        };

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#put
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @param {object} data Item to be inserted.
         * @description Similar to getInit, but we don't have a transaction to pass in
         */
        this.put = function (storeName, data) {
            $log.debug('IDB put');
            var request = this.getTransactionStore(storeName, "readwrite").put(data);
            request.onsuccess = function () {
                $rootScope.$emit('put', [self.dbName, storeName]);
            };
            request.onerror = self.failure;
        };

        /**
         * @ngdoc method
         * @name AppCache.service:IDB#removeAll
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @description Remove all items form the given store object
         */
        this.removeAll = function (storeName) {
            $log.debug('IDB put');
            var request = this.getTransactionStore(storeName, "readwrite").clear();
            request.onsuccess = function () {
                $rootScope.$emit('clear', [self.dbName, storeName]);
            };
            request.onerror = self.failure;
        };


        /**
         * @ngdoc method
         * @name AppCache.service:IDB#batchInsert
         * @methodOf AppCache.service:IDB
         * @param {string} storeName The asssigned name of the store object.
         * @param {object} data Objects to be inserted.
         * @description Data should be an array of objects
         */
        this.batchInsert = function (storeName, data) {
            $log.debug('IDB batchInsert');
            var objectStore = this.getTransactionStore(storeName, "readwrite");

            var i = 0;
            var putNext = function () {
                if (i < data.length) {
                    var request = objectStore.put(data[i]);
                    request.onsuccess = putNext;
                    request.onerror = self.failure;
                    ++i;
                } else {
                    $log.debug('populate complete');
                    $rootScope.$emit('batchinsert', [self.dbName, storeName]);
                }
            };

            putNext();
        };

    }]);
