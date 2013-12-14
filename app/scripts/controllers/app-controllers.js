'use strict';

/*
 * Controllers for development topics management.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('appverseClientIncubatorApp')

.controller('TopicsController', ['$log', '$scope', '$state', '$stateParams', 'utils', 'RESTFactory',
    function ($log, $scope, $state, $stateParams, utils, RESTFactory) {

        $scope.alltopics = RESTFactory.readList('topics.json');

        $scope.goToRandom = function () {
            if ($scope.topics) {
                var randId = utils.newRandomKey($scope.topics, 'id', $state.params.topicId);

                // $state.go() can be used as a high level convenience method
                // for activating a state programmatically.
                $state.go('topics.detail', {
                    topicId: randId
                });
            } else {
                $scope.topicsError = true;
            }
        };

        $scope.findById = function (object, id) {
            //            $log.debug('object', object);
            //            $log.debug('id', id);
            if (object) {
                return utils.findById(object, id);
            }
        };
    }])

.controller('TopicDetailsController',
    function ($log) {
        $log.debug('TopicDetailsController loading...');
    })

.controller('TopicDetailsItemController',
    function ($scope, $stateParams, $state) {

        $scope.getSelectedItem = function () {
            if ($scope.topic) {
                return $scope.findById($scope.topic.items, $stateParams.itemId);
            }
        };

        $scope.edit = function () {
            // Here we show off go's ability to navigate to a relative state. Using '^' to go upwards
            // and '.' to go down, you can navigate to any relative state (ancestor or descendant).
            // Here we are going down to the child state 'edit' (full name of 'topics.detail.item.edit')
            $state.go('.edit', $stateParams);
        };
    })

.controller('TopicDetailsItemEditController',
    function ($log, $scope, $stateParams, $state, Restangular) {

        $scope.getSelectedItem = function () {
            if ($scope.topic) {
                return $scope.findById($scope.topic.items, $stateParams.itemId);
            }
        };

        $scope.done = function () {
            // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.

            Restangular.copy($scope.topic).put();

            $state.go('^', $stateParams);
        };
    })

.controller('cacheController',
    function () {
        console.log('cacheController loading');
    })

.controller('translationController', ['$scope', '$translate', 'tmhDynamicLocale',
    function ($scope, $translate, tmhDynamicLocale) {

        $scope.now = new Date();
        $scope.name = 'Alicia';
        $scope.age = '25';

        $scope.setLocale = function (locale) {
            $translate.uses(locale);
            tmhDynamicLocale.set(locale.toLowerCase());
        };
    }])

    .controller('serverpushController', ['$scope', 'SocketFactory',
        function ($scope, SocketFactory) {
            //Checks if the initial stock data set is displayed.
            var loaded = false;

            $scope.startPush = function () {
                /*
                 Step 1
                 Initializes communication to server
                 */
                SocketFactory.sendMessage('requestData', {});

                /*
                 Step 2
                 Retrieves the initial data set.
                 The callback is attaching the stock data to the scope.
                 */
                SocketFactory.listen('initExchangeData', function (data){
                    $scope.stocks = data.exchangeData;
                    loaded = true;
                });

                /*
                 Step 3
                 Retrieves updates for the data set.
                 The callback is updating the stock data in the scope.
                 The listening is bound to the current scope. So, communication
                 will be closed when the scope is destroyed.
                 */
                SocketFactory.listenScope('exchangeData', $scope, function (deltas){
                    if (loaded) {
                        //Updates values in the table with pushed data
                        changeValue(deltas);
                        /*
                        console.log('TP|data.exchangeData.st: ' + deltas.st);
                        console.log('TP|data.exchangeData.tp: ' + deltas.tp);
                        console.log('TP|data.exchangeData.tv: ' + deltas.tv);

                        console.log('TP|data.exchangeData.b1p: ' + deltas.b1p);
                        console.log('TP|data.exchangeData.b2p: ' + deltas.b2p);
                        console.log('TP|data.exchangeData.b3p: ' + deltas.b3p);
                        console.log('TP|data.exchangeData.b4p: ' + deltas.b4p);
                        console.log('TP|data.exchangeData.b5p: ' + deltas.b5p);

                        console.log('TP|data.exchangeData.b1v: ' + deltas.b1v);
                        console.log('TP|data.exchangeData.b2v: ' + deltas.b2v);
                        console.log('TP|data.exchangeData.b3v: ' + deltas.b3v);
                        console.log('TP|data.exchangeData.b4v: ' + deltas.b4v);
                        console.log('TP|data.exchangeData.b5v: ' + deltas.b5v);

                        console.log('TP|data.exchangeData.a1p: ' + deltas.a1p);
                        console.log('TP|data.exchangeData.a2p: ' + deltas.a2p);
                        console.log('TP|data.exchangeData.a3p: ' + deltas.a3p);
                        console.log('TP|data.exchangeData.a4p: ' + deltas.a4p);
                        console.log('TP|data.exchangeData.a5p: ' + deltas.a5p);

                        console.log('TP|data.exchangeData.a1v: ' + deltas.a1v);
                        console.log('TP|data.exchangeData.a2v: ' + deltas.a2v);
                        console.log('TP|data.exchangeData.a3v: ' + deltas.a3v);
                        console.log('TP|data.exchangeData.a4v: ' + deltas.a4v);
                        console.log('TP|data.exchangeData.a5v: ' + deltas.a5v);
                        */
                    }
                });
            }

            /*
             Step 4
             The user can cancel the pushing from server.
             */
            $scope.endPush = function () {
                SocketFactory.unsubscribeCommunication();
            };

            // -----------------
            // Private helpers
            // -----------------

            /*
             Updates the specific stock price/value pair
             */
            function changeValue (deltas) {
                var i;
                for (i = 0; i < $scope.stocks.length; i++) {
                    if ($scope.stocks[i].st === deltas.st) {
                        $scope.stocks[i].tp = deltas.tp;
                        $scope.stocks[i].tv = deltas.tv;

                        $scope.stocks[i].b1p = deltas.b1p;
                        $scope.stocks[i].b2p = deltas.b2p;
                        $scope.stocks[i].b3p = deltas.b3p;
                        $scope.stocks[i].b4p = deltas.b4p;
                        $scope.stocks[i].b5p = deltas.b5p;

                        $scope.stocks[i].b1v = deltas.b1v;
                        $scope.stocks[i].b2v = deltas.b2v;
                        $scope.stocks[i].b3v = deltas.b3v;
                        $scope.stocks[i].b4v = deltas.b4v;
                        $scope.stocks[i].b5v = deltas.b5v;

                        $scope.stocks[i].a1p = deltas.a1p;
                        $scope.stocks[i].a2p = deltas.a2p;
                        $scope.stocks[i].a3p = deltas.a3p;
                        $scope.stocks[i].a4p = deltas.a4p;
                        $scope.stocks[i].a5p = deltas.a5p;

                        $scope.stocks[i].a1v = deltas.a1v;
                        $scope.stocks[i].a2v = deltas.a2v;
                        $scope.stocks[i].a3v = deltas.a3v;
                        $scope.stocks[i].a4v = deltas.a4v;
                        $scope.stocks[i].a5v = deltas.a5v;
                    }
                }
            }

        }]);


