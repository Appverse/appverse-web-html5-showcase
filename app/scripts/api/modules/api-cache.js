'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// CACHE
// PRIMARY MODULE (AppCache)
////////////////////////////////////////////////////////////////////////////
// The Cache module includes several types of cache.
// Scope Cache: To be used in a limited scope. It does not persist when navigation.
// Browser Storage: It handles short strings into local or session storage. Access is synchronous.
// IndexedDB: It initializes indexed database at browser to handle data structures. Access is asynchronous.
// Http Cache: It initializes cache for the $httpProvider. $http service instances will use this cache.
//
// WARNING - HTTP Service Cache:
// The rest module handles its own cache. So, HttpCache affects only to manually created $http objects.
//
// WARNING - IndexedDB Usage:
// IndexedDB works both online and offline, allowing for client-side storage of large amounts of structured data,
// in-order key retrieval, searches over the values stored, and the option to store multiple values per key.
// With IndexedDB, all calls are asynchronous and all interactions happen within a transaction.
// Consider Same-origin policy constraints when accessing the IDB. This module creates a standard default IDB for
// the application domain.
// In order to make easiest as possible usage of the API two methods have been defined. The below example
// shows how to use these object to build custom queries to the IDB considering the initialization parameters:
//  function (param){
//      var queryBuilder = CacheFactory.getIDBQueryBuilder();
//      var objStore = CacheFactory.getIDBObjectStore();
//      var myQuery = queryBuilder.$index(CACHE_CONFIG.IndexedDB_mainIndex).$gt(param).$asc.compile;
//      objStore.each(myQuery).then(function(cursor){
//          $scope.key = cursor.key;
//          $scope.value = cursor.value;
//      });
// }
////////////////////////////////////////////////////////////////////////////

angular.module('AppCache', ['ng', 'ngStorage', 'AppConfiguration', 'AppIndexedDB', 'jmdobry.angular-cache'])
    .run(['$log', 'CacheFactory', 'CACHE_CONFIG',
        function ($log, CacheFactory, CACHE_CONFIG) {

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
                    CACHE_CONFIG.BrowserStorage_type
                );
            }

            /* The cache for http calls */
            if (CACHE_CONFIG.HttpCache_Enabled) {
                CacheFactory.setDefaultHttpCacheStorage(
                    CACHE_CONFIG.HttpCache_duration,
                    CACHE_CONFIG.HttpCache_capacity);
            }

            if (CACHE_CONFIG.IndexedDBCache_Enabled) {
                //                CacheFactory.setIndexedDBStorage(
                //                    CACHE_CONFIG.IndexedDB_objectStore,
                //                    CACHE_CONFIG.IndexedDB_keyPath,
                //                    CACHE_CONFIG.IndexedDB_mainIndex,
                //                    CACHE_CONFIG.IndexedDB_mainIndex_isUnique,
                //                    CACHE_CONFIG.IndexedDB_secondaryIndex,
                //                    CACHE_CONFIG.IndexedDB_secondaryIndex_isUnique
                //                );
            }
        }])
    .factory('CacheFactory', [
        '$angularCacheFactory',
        '$localStorage',
        '$sessionStorage',
        '$http',
        '$indexedDB',
        'CACHE_CONFIG',
        function ($angularCacheFactory, $localStorage, $sessionStorage, $http, $indexedDB, CACHE_CONFIG) {

            var factory = {};

            /*
             @function
             @param duration  items expire after this time.
             @param capacity  turns the cache into LRU (Least Recently Used) cache.
             If you don't want $http's default cache to store every response.
             @description getScopeCache is the singleton that CacheFactory manages as a local cache created with
             $angularCacheFactory, which is what we return from the service. Then, we can inject this into any controller we
             want and it will always return the same values.

             The newly created cache object has the following set of methods:
             {object} info() — Returns id, size, and options of cache.
             {{*}} put({string} key, {*} value) — Puts a new key-value pair into the cache and returns it.
             {{*}} get({string} key) — Returns cached value for key or undefined for cache miss.
             {void} remove({string} key) — Removes a key-value pair from the cache.
             {void} removeAll() — Removes all cached values.
             {void} destroy() — Removes references to this cache from $angularCacheFactory.
             */
            factory.setScopeCache = function (duration, capacity) {
                var _scopeDataCache = $angularCacheFactory('scopeDataCache', {
                    maxAge: duration,
                    capacity: capacity
                });
                return _scopeDataCache;
            };
            /*
             @function
             @param type Type of storage ( 1 local | 2 session).
             @description This object makes Web Storage working in the Angular Way.
             By default, web storage allows you 5-10MB of space to work with, and your data is stored locally
             on the device rather than passed back-and-forth with each request to the server.
             Web storage is useful for storing small amounts of key/value data and preserving functionality
             online and offline.
             With web storage, both the keys and values are stored as strings.

             We can store anything except those not supported by JSON:
             Infinity, NaN - Will be replaced with null.
             undefined, Function - Will be removed.
             The returned object supports the following set of methods:
             {void} $reset() - Clears the Storage in one go.
             */
            factory.setBrowserStorage = function (type) {
                if (type === 1) {
                    var _lstore = $localStorage;
                    return _lstore;
                } else if (type === 2) {
                    var _sstore = $sessionStorage;
                    return _sstore;
                }
            };

            /*
             @function
             @param
             @description Initializes the default IDB.
             The HTML5 indexedDB feature works both online and offline, allowing for client-side storage of large
             amounts of structured data, in-order key retrieval, searches over the values stored, and the option
             to store multiple values per key.
             IndexedDB offers asynchronous calls and all interactions happen within a transaction.
             This method initializes a basic cache for data structure storage.
             */
            factory.setIDBStorage = function (objectStore, keyPathValue, mainIndex, mainIndexUnique, secIndex, secIndexUnique) {
                /*
                 The connection method takes the database name as parameter, the upgradeCallback has
                 3 parameters: function callback(event, database, transaction).
                 For upgrading your db structure, see:
                 https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB.
                 */
                $indexedDB.connection(CACHE_CONFIG.IndexedDB_objectStore)
                    .upgradeDatabase(myVersion, function (event, db, tx) {
                        var objStore = db.createObjectStore(objectStore, {
                            keyPath: keyPathValue
                        });
                        objStore.createIndex('primary_idx', mainIndex, {
                            unique: mainIndexUnique
                        });
                        objStore.createIndex('secondary_idx', secIndex, {
                            unique: secIndexUnique
                        });
                        return objStore;
                    });
            };

            /*
             @function
             @param
             @description Saves a data structure into the default IDB
             */
            factory.setDataIntoIDB = function (data, callback) {
                var objectStore = $indexedDB.objectStore(CACHE_CONFIG.IndexedDB_objectStore);
                objectStore.insert(data).then(callback);
            };

            /*
             @function
             @param
             @description Gets the entire data structure from the default IDB
             */
            factory.getDataStructureFromIDB = function (callback) {
                var objectStore = $indexedDB.objectStore(CACHE_CONFIG.IndexedDB_objectStore);
                objectStore.getAll().then(callback);
            };

            /*
             @function
             @param
             @description returns the objectStore object in order the app can use the Query Builder.
             List of defined functions for ObjectStore (AppIndexedDB module):
             abort
             insert
             upsert
             delete
             clear
             count
             find
             getAll
             each
             */
            factory.getIDBObjectStore = function () {
                return $indexedDB.objectStore(CACHE_CONFIG.IndexedDB_objectStore);
            };

            /*
             @function
             @param
             @description returns the QueryBuilder object in order to build queries t be passed to the object store.
             List of defined functions for QueryBuilder (AppIndexedDB module):
             $lt
             $gt
             $lte
             $gte
             $eq
             $between
             $asc
             $desc
             $index
             */
            factory.getIDBQueryBuilder = function () {
                return $indexedDB.queryBuilder();
            };

            /*
             @function
             @param duration items expire after this time.
             @param capacity  turns the cache into LRU (Least Recently Used) cache.
             If you don't want $http's default cache to store every response.
             @description getScopeCache is the singleton that CacheFactory manages
             as a local cache created with $angularCacheFactory, which is what we return
             from the service. We can inject this into any controller we
             want and it will always return the same values.
             @description
             Your can retrieve the currently cached data: var cachedData =
             */
            factory.setDefaultHttpCacheStorage = function (maxAge, capacity) {

                var cacheId = 'MyHttpAngularCache';
                var cache = $angularCacheFactory.get(cacheId);

                if (!cache) {
                    cache = $angularCacheFactory(cacheId, {
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
                    cache.setOptions({
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
                $http.defaults.cache = cache;
            };

            factory.removeDefaultHttpCacheStorage = function () {
                $http.defaults.cache.removeAll();
            };

            return factory;
        }
    ]);



////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// SECONDARY MODULE (AppIndexedDB)
////////////////////////////////////////////////////////////////////////////
// Angularjs serviceprovider to utilize indexedDB with angular.
// Normally, and as a recommendation, we should have only one indexedDB per app.
//
/*
Connect to the browser's db.
Then, you can use $indexedDB inside controllers like this:
1-Include $indexedDB as a dependency (served by the $indexedDBProvider object).
2-Initialize the object store
var indexedDBObjectStore = $indexedDB.objectStore(CACHE_SERVICE.IndexedDB_objectStore);
3-Insert data:
    indexedDBObjectStore.insert({CACHE_SERVICE.IndexedDB_keyPath: "444-444-222-111","name": "John Doe", "age": 57})
.then(function(e){
    ...
});
4-Get data:
    indexedDBObjectStore.getAll().then(function(results) {
        // Update scope
        $scope.objects = results;
    });
*/
////////////////////////////////////////////////////////////////////////////
/** unify browser specific implementations */
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBKeyRange = window.IDBKeyRange || window.mozIDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

angular.module('AppIndexedDB', [])
    .provider('$indexedDB', function () {

        var module = this,
            /** IDBTransaction mode constants */
            READONLY = "readonly",
            READWRITE = "readwrite",
            VERSIONCHANGE = "versionchange",
            /** IDBCursor direction and skip behaviour constants */
            NEXT = "next",
            NEXTUNIQUE = "nextunique",
            PREV = "prev",
            PREVUNIQUE = "prevunique";

        /** predefined variables */
        module.dbName = '';
        module.dbVersion = 1;
        module.db = null;

        /** predefined callback functions, can be customized in angular.config */
        module.onTransactionComplete = function (e) {
            console.log('Transaction completed.');
        };
        module.onTransactionAbort = function (e) {
            console.log('Transaction aborted: ' + e.target.webkitErrorMessage || e.target.errorCode);
        };
        module.onTransactionError = function (e) {
            console.log('Transaction failed: ' + e.target.errorCode);
        };
        module.onDatabaseError = function (e) {
            alert("Database error: " + e.target.webkitErrorMessage || e.target.errorCode);
        };
        module.onDatabaseBlocked = function (e) {
            // If some other tab is loaded with the database, then it needs to be closed
            // before we can proceed.
            alert("Database is blocked. Try close other tabs with this page open and reload this page!");
        };

        /**
         * @ngdoc function
         * @name $indexedDBProvider.connection
         * @function
         *
         * @description
         * sets the name of the database to use
         *
         * @param {string} databaseName database name.
         * @returns {object} this
         */
        module.connection = function (databaseName) {
            module.dbName = databaseName;
            return this;
        };

        /**
         * @ngdoc function
         * @name $indexedDBProvider.upgradeDatabase
         * @function
         *
         * @description provides version number and steps to upgrade the database wrapped in a
         * callback function
         *
         * @param {number} newVersion new version number for the database.
         * @param {function} callback the callback which proceeds the upgrade
         * @returns {object} this
         */
        module.upgradeDatabase = function (newVersion, callback) {
            module.dbVersion = newVersion;
            module.upgradeCallback = callback;
            return this;
        };

        module.$get = ['$q', '$rootScope',
        function ($q, $rootScope) {
                /**
                 * @ngdoc object
                 * @name defaultQueryOptions
                 * @function
                 *
                 * @description optionally specify for cursor requests:
                 * - which index to use
                 * - a keyRange to apply
                 * - the direction of traversal (bottom to top/top to bottom)
                 */
                var defaultQueryOptions = {
                    useIndex: undefined,
                    keyRange: null,
                    direction: NEXT
                };
                /**
                 * @ngdoc object
                 * @name dbPromise
                 * @function
                 *
                 * @description open the database specified in $indexedDBProvider.connection and
                 * $indexdDBProvider.upgradeDatabase and returns a promise for this connection
                 * @params
                 * @returns {object} promise $q.promise to fullfill connection
                 */
                var dbPromise = function () {
                    var dbReq, defered = $q.defer();
                    if (!module.db) {
                        dbReq = indexedDB.open(module.dbName, module.dbVersion || 1);
                        dbReq.onsuccess = function (e) {
                            module.db = dbReq.result;
                            $rootScope.$apply(function () {
                                defered.resolve(module.db);
                            });
                        };
                        dbReq.onblocked = module.onDatabaseBlocked;
                        dbReq.onerror = module.onDatabaseError;
                        dbReq.onupgradeneeded = function (e) {
                            var db = e.target.result,
                                tx = e.target.transaction;
                            console.log('upgrading database "' + db.name + '" from version ' + e.oldVersion +
                                ' to version ' + e.newVersion + '...');
                            module.upgradeCallback && module.upgradeCallback(e, db, tx);
                        };
                    } else {
                        defered.resolve(module.db);
                    }
                    return defered.promise;
                };
                /**
                 * @ngdoc object
                 * @name ObjectStore
                 * @function
                 *
                 * @description wrapper for IDBObjectStore
                 *
                 * @params {string} storeName name of the objectstore
                 */
                var ObjectStore = function (storeName) {
                    this.storeName = storeName;
                    this.transaction = undefined;
                };
                ObjectStore.prototype = {
                    /**
                     * @ngdoc method
                     * @name ObjectStore.internalObjectStore
                     * @function
                     *
                     * @description used internally to retrieve an objectstore
                     * with the correct transaction mode
                     *
                     * @params {string} storeName name of the objectstore
                     * @params {string} mode transaction mode to use for operation
                     * @returns {object} IDBObjectStore the objectstore in question
                     */
                    internalObjectStore: function (storeName, mode) {
                        var me = this;
                        return dbPromise().then(function (db) {
                            me.transaction = db.transaction([storeName], mode || READONLY);
                            me.transaction.oncomplete = module.onTransactionComplete;
                            me.transaction.onabort = module.onTransactionAbort;
                            me.onerror = module.onTransactionError;

                            return me.transaction.objectStore(storeName);
                        });
                    },
                    /**
                     * @ngdoc method
                     * @name ObjectStore.abort
                     * @function
                     *
                     * @description abort the current transaction
                     */
                    "abort": function () {
                        if (this.transaction) {
                            this.transaction.abort();
                        }
                    },
                    /**
                     * @ngdoc method
                     * @name ObjectStore.insert
                     * @function
                     *
                     * @description wrapper for IDBObjectStore.add.
                     * input data can be a single object or an array of objects for
                     * bulk insertions within a single transaction
                     *
                     * @params {object or array} data the data to insert
                     * @returns {object} $q.promise a promise on successfull execution
                     */
                    "insert": function (data) {
                        var d = $q.defer();
                        return this.internalObjectStore(this.storeName, READWRITE).then(function (store) {
                            var req;
                            if (angular.isArray(data)) {
                                data.forEach(function (item) {
                                    req = store.add(item);
                                    req.onsuccess = req.onerror = function (e) {
                                        $rootScope.$apply(function () {
                                            d.resolve(e.target.result);
                                        });
                                    };
                                });
                            } else {
                                req = store.add(data);
                                req.onsuccess = req.onerror = function (e) {
                                    $rootScope.$apply(function () {
                                        d.resolve(e.target.result);
                                    });
                                };
                            }
                            return d.promise;
                        });
                    },
                    /**
                     * @ngdoc method
                     * @name ObjectStore.upsert
                     * @function
                     *
                     * @description wrapper for IDBObjectStore.put.
                     * modifies existing values or inserts as new value if nonexistant
                     * input data can be a single object or an array of objects for
                     * bulk updates/insertions within a single transaction
                     *
                     * @params {object or array} data the data to upsert
                     * @returns {object} $q.promise a promise on successfull execution
                     */
                    "upsert": function (data) {
                        var d = $q.defer();
                        return this.internalObjectStore(this.storeName, READWRITE).then(function (store) {
                            var req;
                            if (angular.isArray(data)) {
                                data.forEach(function (item) {
                                    req = store.put(item);
                                    req.onsuccess = req.onerror = function (e) {
                                        $rootScope.$apply(function () {
                                            d.resolve(e.target.result);
                                        });
                                    };
                                });
                            } else {
                                req = store.put(data);
                                req.onsuccess = req.onerror = function (e) {
                                    $rootScope.$apply(function () {
                                        d.resolve(e.target.result);
                                    });
                                };
                            }
                            return d.promise;
                        });
                    },
                    /**
                     * @ngdoc method
                     * @name ObjectStore.delete
                     * @function
                     *
                     * @description wrapper for IDBObjectStore.delete.
                     * deletes the value for the specified primary key
                     *
                     * @params {any value} key primary key to indetify a value
                     * @returns {object} $q.promise a promise on successfull execution
                     */
                    "delete": function (key) {
                        var d = $q.defer();
                        return this.internalObjectStore(this.storeName, READWRITE).then(function (store) {
                            var req = store.delete(key);
                            req.onsuccess = req.onerror = function (e) {
                                $rootScope.$apply(function () {
                                    d.resolve(e.target.result);
                                });
                            };
                            return d.promise;
                        });
                    },
                    /**
                     * @ngdoc method
                     * @name ObjectStore.clear
                     * @function
                     *
                     * @description wrapper for IDBObjectStore.clear.
                     * removes all data in an objectstore
                     *
                     * @returns {object} $q.promise a promise on successfull execution
                     */
                    "clear": function () {
                        var d = $q.defer();
                        return this.internalObjectStore(this.storeName, READWRITE).then(function (store) {
                            var req = store.clear();
                            req.onsuccess = req.onerror = function (e) {
                                $rootScope.$apply(function () {
                                    d.resolve(e.target.result);
                                });
                            };
                            return d.promise;
                        });
                    },
                    /**
                     * @ngdoc method
                     * @name ObjectStore.count
                     * @function
                     *
                     * @description wrapper for IDBObjectStore.count.
                     * returns the number of values in the objectstore, as a promise
                     *
                     * @returns {object} $q.promise a promise on successfull execution
                     */
                    "count": function () {
                        return this.internalObjectStore(this.storeName, READONLY).then(function (store) {
                            return store.count();
                        });
                    },
                    /**
                     * @ngdoc method
                     * @name ObjectStore.find
                     * @function
                     *
                     * @description wrapper for IDBObjectStore.get and IDBIndex.get.
                     * retrieves a single value with specified key, or index-key
                     *
                     * @params {any value} keyOrIndex the key to value, or an indexName
                     * @params {any value} key the key of an index (*optional*)
                     * @returns {any value} value ...wrapped in a promise
                     */
                    "find": function (keyOrIndex, keyIfIndex) {
                        var d = $q.defer();
                        var promise = d.promise;
                        return this.internalObjectStore(this.storeName, READONLY).then(function (store) {
                            var req;

                            if (keyIfIndex) {
                                req = store.index(keyOrIndex).get(keyIfIndex);
                            } else {
                                req = store.get(keyOrIndex);
                            }
                            req.onsuccess = req.onerror = function (e) {
                                $rootScope.$apply(function () {
                                    d.resolve(e.target.result);
                                });
                            };
                            return promise;
                        });
                    },
                    /**
                     * @ngdoc method
                     * @name ObjectStore.getAll
                     * @function
                     *
                     * @description wrapper for IDBObjectStore.getAll (or shim).
                     * retrieves all values from objectstore using IDBObjectStore.getAll
                     * or a cursor request if getAll is not implemented
                     *
                     * @returns {array} values ...wrapped in a promise
                     */
                    "getAll": function () {
                        var results = [],
                            d = $q.defer();
                        return this.internalObjectStore(this.storeName, READONLY).then(function (store) {
                            var req;
                            if (store.getAll) {
                                req = store.getAll();
                                req.onsuccess = req.onerror = function (e) {
                                    $rootScope.$apply(function () {
                                        d.resolve(e.target.result);
                                    });
                                };
                            } else {
                                req = store.openCursor();
                                req.onsuccess = function (e) {
                                    var cursor = e.target.result;
                                    if (cursor) {
                                        results.push(cursor.value);
                                        cursor.
                                        continue ();
                                    } else {
                                        $rootScope.$apply(function () {
                                            d.resolve(results);
                                        });
                                    }
                                };
                                req.onerror = function (e) {
                                    d.reject(e.target.result);
                                };
                            }
                            return d.promise;
                        });
                    },
                    /**
                     * @ngdoc method
                     * @name ObjectStore.each
                     * @function
                     *
                     * @description wrapper for IDBObjectStore.openCursor or IDBIndex.openCursor.
                     * returns an IDBCursor for further manipulation. See indexedDB documentation
                     * for details on this.
                     * https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB#Using_a_cursor
                     *
                     * @params {object} options optional query parameters, see defaultQueryOptions
                     * and QueryBuilder for details
                     * @returns {object} IDBCursor ...wrapped in a promise
                     */
                    "each": function (options) {
                        var d = $q.defer();
                        return this.internalObjectStore(this.storeName, READWRITE).then(function (store) {
                            var req;
                            options = options || defaultQueryOptions;
                            if (options.useIndex) {
                                req = store.index(options.useIndex).openCursor(options.keyRange, options.direction);
                            } else {
                                req = store.openCursor(options.keyRange, options.direction);
                            }
                            req.onsuccess = req.onerror = function (e) {
                                $rootScope.$apply(function () {
                                    d.resolve(e.target.result);
                                });
                            };
                            return d.promise;
                        });
                    }
                };

                /**
                 * @ngdoc object
                 * @name QueryBuilder
                 * @function
                 *
                 * @description utility object to easily create IDBKeyRange for cursor queries
                 */
                var QueryBuilder = function () {
                    this.result = defaultQueryOptions;
                };
                QueryBuilder.prototype = {
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.$lt
                     * @function
                     *
                     * @description set an upper bound, e.g. A < value, excluding value
                     *
                     * @params {any value} value bound value
                     * @returns {object} this QueryBuilder, for chaining params
                     */
                    "$lt": function (value) {
                        this.result.keyRange = IDBKeyRange.upperBound(value, true);
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.$gt
                     * @function
                     *
                     * @description set a lower bound, e.g. A > value, excluding value
                     *
                     * @params {any value} value bound value
                     * @returns {object} this QueryBuilder, for chaining params
                     */
                    "$gt": function (value) {
                        this.result.keyRange = IDBKeyRange.lowerBound(value, true);
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.$lte
                     * @function
                     *
                     * @description set an upper bound, e.g. A <= value, including value
                     *
                     * @params {any value} value bound value
                     * @returns {object} this QueryBuilder, for chaining params
                     */
                    "$lte": function (value) {
                        this.result.keyRange = IDBKeyRange.upperBound(value);
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.$gte
                     * @function
                     *
                     * @description set an upper bound, e.g. A >= value, including value
                     *
                     * @params {any value} value bound value
                     * @returns {object} this QueryBuilder, for chaining params
                     */
                    "$gte": function (value) {
                        this.result.keyRange = IDBKeyRange.lowerBound(value);
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.$eq
                     * @function
                     *
                     * @description exact match, e.g. A = value
                     *
                     * @params {any value} value bound value
                     * @returns {object} this QueryBuilder, for chaining params
                     */
                    "$eq": function (value) {
                        this.result.keyRange = IDBKeyRange.only(value);
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.$between
                     * @function
                     *
                     * @description set an upper and lower bound, e.g. low >= value <= hi,
                     * optionally including value
                     *
                     * @params {any value} lowValue lower bound value
                     * @params {any value} hiValue upper bound value
                     * @params {boolean} exLow optional, exclude lower bound value
                     * @params {boolean} exHi optional, exclude upper bound value
                     * @returns {object} this QueryBuilder, for chaining params
                     */
                    "$between": function (lowValue, hiValue, exLow, exHi) {
                        this.result.keyRange = IDBKeyRange.bound(lowValue, hiValue, exLow || false, exHi || false);
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.$asc
                     * @function
                     *
                     * @description set the direction of traversal to ascending (natural)
                     *
                     * @params {boolean} unique return only distinct values, skipping
                     * duplicates (*optional*)
                     * @returns {object} this QueryBuilder, for chaining params
                     */
                    "$asc": function (unique) {
                        this.result.order = (unique) ? NEXTUNIQUE : NEXT;
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.$desc
                     * @function
                     *
                     * @description set the direction of traversal to descending order
                     *
                     * @params {boolean} unique return only distinct values, skipping
                     * duplicates (*optional*)
                     * @returns {object} this QueryBuilder, for chaining params
                     */
                    "$desc": function (unique) {
                        this.result.order = (unique) ? PREVUNIQUE : PREV;
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.$index
                     * @function
                     *
                     * @description optionally specify an index to use
                     *
                     * @params {string} indexName index to use
                     * @returns {object} this QueryBuilder, for chaining params
                     */
                    "$index": function (indexName) {
                        this.result.useIndex = indexName;
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name QueryBuilder.compile
                     * @function
                     *
                     * @description returns an object to be passed to ObjectStore.each
                     * @returns {object} queryOptions
                     */
                    "compile": function () {
                        return this.result;
                    }
                };

                /**
                 * @ngdoc angular.$provider
                 * @name $indexedDB
                 * @function
                 *
                 * @description indexedDB provider object
                 */
                return {
                    /**
                     * @ngdoc method
                     * @name $indexedDB.objectStore
                     * @function
                     *
                     * @description an IDBObjectStore to use
                     *
                     * @params {string} storename the name of the objectstore to use
                     * @returns {object} ObjectStore
                     */
                    "objectStore": function (storeName) {
                        return new ObjectStore(storeName);
                    },
                    /**
                     * @ngdoc method
                     * @name $indexedDB.dbInfo
                     * @function
                     *
                     * @description statistical information about the current database
                     * - database name and version
                     * - objectstores in in database with name, value count, keyPath,
                     *   autoincrement flag and current assigned indices
                     *
                     * @returns {object} DBInfo
                     */
                    "dbInfo": function () {
                        var storeNames, stores = [],
                            tx, store;
                        return dbPromise().then(function (db) {
                            storeNames = Array.prototype.slice.apply(db.objectStoreNames);
                            tx = db.transaction(storeNames, READONLY);
                            storeNames.forEach(function (storeName) {
                                store = tx.objectStore(storeName);
                                stores.push({
                                    name: storeName,
                                    keyPath: store.keyPath,
                                    autoIncrement: store.autoIncrement,
                                    count: store.count(),
                                    indices: Array.prototype.slice.apply(store.indexNames)
                                });
                            });
                            return {
                                name: db.name,
                                version: db.version,
                                objectStores: stores
                            };
                        });
                    },
                    /**
                     * @ngdoc method
                     * @name $indexedDB.close
                     * @function
                     *
                     * @description closes the current active database
                     * @returns {object} this
                     */
                    "closeDB": function () {
                        dbPromise().then(function (db) {
                            db.close();
                        });
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name $indexedDB.switchDB
                     * @function
                     *
                     * @description closes the current active database and opens another one
                     *
                     * @params {string} databaseName the name of the database to use
                     * @params {number} version the version number of the database
                     * @params {Function} upgradeCallBack the callback which proceeds the upgrade
                     * @returns {object} this
                     */
                    "switchDB": function (databaseName, version, upgradeCallback) {
                        this.closeDB();
                        module.db = null;
                        module.dbName = databaseName;
                        module.dbVersion = version || 1;
                        module.upgradeCallback = upgradeCallback || function () {};
                        return this;
                    },
                    /**
                     * @ngdoc method
                     * @name $indexedDB.queryBuilder
                     * @function
                     *
                     * @description provides access to the QueryBuilder utility
                     *
                     * @returns {object} QueryBuilder
                     */
                    "queryBuilder": function () {
                        return new QueryBuilder();
                    }
                };
            }
    ];
    });
