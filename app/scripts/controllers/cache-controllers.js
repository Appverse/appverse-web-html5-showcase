'use strict';

/*
 * Controllers for cache demo.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('appverseClientIncubatorApp')

.controller('cacheController', ['$log',
    function ($log) {
        $log.debug('cacheController loading');
    }])

.controller('cacheState1Controller', ['$log',
    function ($log) {
        $log.debug('cacheState1Controller loading');
    }])

.controller('cacheState2Controller', ['$log',
    function ($log) {
        $log.debug('cacheState2Controller loading');
    }])

.controller('cacheIDBController', ['$scope', '$rootScope', '$log', 'IDB', 'CACHE_CONFIG',
    function ($scope, $rootScope, $log, IDB, CACHE_CONFIG) {
    var self = this;
    var storeIndex = 0;
    var STORE_NAME = CACHE_CONFIG.IndexedDB_options[storeIndex].storeName;
    
    //A default list of values for the demo is included.
    var defaultList = [
        {
            id: "1",
            name: "item1",
            param: "It is a non-key, non-index parameter"
        },
        {
            id: "2",
            name: "item2",
            param: "It is a non-key, non-index parameter"
        },
        {
            id: "3",
            name: "item3",
            param: "It is a non-key, non-index parameter"
        },
        {
            id: "4",
            name: "item1",
            param: "It has the same name, but a different id as 1"
        }
    ];

    $scope.listOfItems = [];

    $scope.addItem = function(item){
        $log.debug('Add an Item to IDB');
        IDB.put(STORE_NAME, item);
    };

    $scope.removeAll = function(){
        $log.debug('Remove ALL items in IDB');
        IDB.removeAll(STORE_NAME);
    };

    $scope.removeItem = function(id) {
        $log.debug('Removig an item from the IDB');
        IDB.remove(STORE_NAME, id);
    };

    this.update = function (data) {
        $rootScope.$apply(function () {
            $log.debug('IDB: update, apply', data);
            $scope.listOfItems = data;
            if (!$scope.listOfItems || $scope.listOfItems.length <= 0) {
                $scope.listOfItems = [];
                IDB.batchInsert(STORE_NAME, defaultList);
            }
        });
    };

    var dbupdate = function (event, args) {
        $log.debug("IDB: store DBUPDATE");
        $log.debug('IDB: args', args);
        var dbname = args[0],
            storeName = args[1],
            data = args[2];
        $log.debug('IDB: update', dbname, storeName, data);
        if (dbname === CACHE_CONFIG.IndexedDB_name && storeName === STORE_NAME){
            self.update(data);
        }
    };

    var getAllThings = function (transaction) {
        $log.debug('IDB: getAllThings', transaction);
        if (transaction instanceof IDBTransaction){
            IDB.getInit(transaction, STORE_NAME);
        }else{
            IDB.getAll(STORE_NAME);
        }
    };

    var getAll = function (event, data) {
        $log.debug("IDB: items DBGETALL");
        var dbname = data[0],
            storeName = data[1],
            transaction = data[2];
//        $log.debug('dbname: ' + dbname);
//        $log.debug('storeName: ' + storeName);
//        $log.debug('transaction: ' + transaction);
        
        $log.debug('IDB: getAll', dbname, storeName, transaction);
        if (dbname === CACHE_CONFIG.IndexedDB_name && storeName === STORE_NAME){
            getAllThings(transaction);
        }  
    };

    // This callback is for after the database is initialized the first time
    var postInitDb = function (event, data) {
        var dbname = data[0],
            transaction = data[1];
        $log.debug('IDB: postInit', dbname, transaction);
        if (dbname !== CACHE_CONFIG.IndexedDB_name){
            return;
        }

        getAllThings(transaction);
    };


    $rootScope.$on('failure', function () {
        $log.error('IDB: failed to open Indexed db')
    });
    $rootScope.$on('dbopenupgrade', postInitDb);
    $rootScope.$on('dbopen', postInitDb);

    $rootScope.$on('getinit', dbupdate);
    $rootScope.$on('getall', dbupdate);
    $rootScope.$on('remove', getAll);
    $rootScope.$on('put', getAll);
    $rootScope.$on('clear', getAll);
    $rootScope.$on('batchinsert', getAll);

    (function () {
        // If the idb has not been initialized, then the listeners should work
        if (!IDB.db)
            return;
        // If the idb has been initialized, then the listeners won't get the events,
        // and we need to just do a request immediately
        getAllThings();
    })();

}]);