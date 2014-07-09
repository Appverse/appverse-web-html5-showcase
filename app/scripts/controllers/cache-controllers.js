'use strict';
        /*
         * Controllers for cache demo.
         * Pay attention to injection of dependencies (factories, entities and Angular objects).
         */
        angular.module('appverseClientIncubatorApp')

        .controller('cacheController', ['$log',
            function($log) {
                $log.debug('cacheController loading');
            }])

        .controller('cacheState1Controller', ['$log',
            function($log) {
                $log.debug('cacheState1Controller loading');
            }])

        .controller('cacheState2Controller', ['$log',
            function($log) {
                $log.debug('cacheState2Controller loading');
            }])
       
                
        .controller('simpleIDBController', ['$scope', '$rootScope', '$stateParams', '$log', '$modal', 'IDBService', 'CACHE_CONFIG',
            function($scope, $rootScope, $stateParams, $log, $modal, IDBService, CACHE_CONFIG) {

                if($stateParams.key) {
                    IDBService.getDefault(Number($stateParams.key)).then(function(note) {
                        $scope.note = note;
                        $scope.tagString = "";
                        if(note.tags.length) $scope.tagString = note.tags.join(",");
                    });
                }


                $scope.clearForm = function(){
                    $scope.note.title = "";
                    $scope.note.body = "";
                    $scope.tagString = "";
                    $scope.note.id = ""
                };

                $scope.saveNote = function() {

                    var item = new IDBService.item(
                            $scope.note.id,
                            $scope.note.title,
                            $scope.note.body,
                            //$scope.note.tags
                            $scope.tagString

                    );

                    IDBService.saveDefault(item).then(function(){
                        getNotes();
                    });

                };

                function getNotes(){
                    IDBService.getDefaults().then(function(res){
                        $scope.notes = res;
                    });
                }

                $scope.loadNote = function(key){
                    IDBService.getDefault(key).then(function(note){
                        $scope.note = note;
                        $scope.tagString = note.tags;
                        $scope.noteSelected = true;
                    });
                };

                $scope.deleteNote = function(key){
                    IDBService.deleteDefault(key).then(function(){
                        getNotes();
                    });
                };

                if (IDBService.isSupported()){
                    getNotes();
                } else {
                    $log.error("The HTML5 spec for Indexed DB is not supported in ths browser.");
                }
                

            }])

        .filter('dateFormat', function(){
            return function(input) {
                if (!input)
                    return "";
                input = new Date(input);
                var res = (input.getMonth() + 1) + "/" + input.getDate() + "/" + input.getFullYear() + " ";
                var hour = input.getHours();
                var ampm = "AM";
                if (hour === 12)
                    ampm = "PM";
                if (hour > 12) {
                    hour -= 12;
                    ampm = "PM";
                }
                var minute = input.getMinutes() + 1;
                if (minute < 10)
                    minute = "0" + minute;
                res += hour + ":" + minute + " " + ampm;
                return res;

            };
        });

