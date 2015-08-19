/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf.
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

/*
 * Controllers for performance demo.
 *
 */
angular.module('App.Controllers')

.controller('PerformanceController',
    function ($log) {
        $log.debug('performanceController loading');
    })

.controller('concurrentCallingDataController', ['$log', '$scope', '$q', 'RESTFactory',
        function ($log, $scope, $q, RESTFactory) {
        var gridData = [];
        gridData.push('largeLoad_1');
        gridData.push('largeLoad_2');
        gridData.push('largeLoad_3');
        var starttime = 0;
        var currentTime = 0;

        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };

        $scope.totalServerItems = 0;

        $scope.pagingOptions = {
            pageSizes: [250, 500, 1000],
            pageSize: 250,
            currentPage: 1
        };

        $scope.setPagingData = function (data, page, pageSize) {

            currentTime = new Date().getTime();
            $scope.execTime = currentTime - starttime;

            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            starttime = new Date().getTime();
            var data;
            if (searchText) {
                $log.debug('hi searchText: ' + searchText);
                var ft = searchText.toLowerCase();

                RESTFactory.readParallelMultipleBatch(gridData).then(
                    function (largeLoad) {
                        data = largeLoad.filter(function (item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
                        });
                        $scope.setPagingData(data, page, pageSize);
                    },
                    function (error) {
                        $log.error("Error calling data for grid: " + error);
                    });
            } else {

                RESTFactory.readParallelMultipleBatch(gridData).then(function (largeLoad) {

                    var dst = [];
                    angular.forEach(largeLoad, function (largeLoadSubSet) {
                        $.merge(dst, largeLoadSubSet);
                    });

                    //                        $log.debug("largeLoad: " + JSON.stringify(dst));
                    $scope.setPagingData(dst, page, pageSize);
                }, function (error) {
                    $log.error("Error calling data for grid: " + error);
                });

            }
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
            currentTime = new Date().getTime();

        }, true);
        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
            currentTime = new Date().getTime();
        }, true);

        $scope.gridOptions = {
            data: 'myData',
            rowHeight: 35,
            headerRowHeight: 35,
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            columnDefs: [
                {
                    field: 'name',
                    displayName: 'name',
                    enableCellEdit: false
                },
                {
                    field: 'allowance',
                    displayName: 'allowance',
                    enableCellEdit: false
                }
                ]
        };



        }])

.controller('normalGridController',
    function ($scope, $log, RESTFactory) {

        $log.debug('normalGridController loading');

        var gridData = 'largeLoad';
        var starttime = 0;
        var currentTime = 0;

        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };

        $scope.totalServerItems = 0;

        $scope.pagingOptions = {
            pageSizes: [250, 500, 1000],
            pageSize: 250,
            currentPage: 1
        };

        $scope.setPagingData = function (data, page, pageSize) {

            currentTime = new Date().getTime();
            $scope.execTime = currentTime - starttime;

            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            starttime = new Date().getTime();
            var data;
            if (searchText) {
                $log.debug('hi searchText: ' + searchText);
                var ft = searchText.toLowerCase();

                RESTFactory.readListNoEmpty(gridData).then(
                    function (largeLoad) {
                        data = largeLoad.filter(function (item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
                        });
                        $scope.setPagingData(data, page, pageSize);
                    },
                    function (error) {
                        $log.error("Error calling data for grid: " + error);
                    });
            } else {
                RESTFactory.readListNoEmpty(gridData).then(function (data) {
                    $scope.setPagingData(data, page, pageSize);
                }, function (error) {
                    $log.error("Error calling data for grid: " + error);
                });

            }
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
            currentTime = new Date().getTime();

        }, true);
        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
            currentTime = new Date().getTime();
        }, true);

        $scope.gridOptions = {
            data: 'myData',
            rowHeight: 35,
            headerRowHeight: 35,
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            columnDefs: [
                {
                    field: 'name',
                    displayName: 'name',
                    enableCellEdit: false
                },
                {
                    field: 'allowance',
                    displayName: 'allowance',
                    enableCellEdit: false
                }
                ]
        };
    })

.controller('optimizedGridController', ['$scope', '$log', 'RESTFactory',
        function ($scope, $log, RESTFactory) {
        var gridData = 'largeLoad';
        var starttime = 0;
        var currentTime = 0;

        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };

        $scope.totalServerItems = 0;

        $scope.pagingOptions = {
            pageSizes: [250, 500, 1000],
            pageSize: 250,
            currentPage: 1
        };

        $scope.setPagingData = function (data, page, pageSize) {

            currentTime = new Date().getTime();
            $scope.execTime = currentTime - starttime;

            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            starttime = new Date().getTime();
            var data;
            if (searchText) {
                $log.debug('hi searchText: ' + searchText);
                var ft = searchText.toLowerCase();

                RESTFactory.readBatch(gridData).then(
                    function (largeLoad) {
                        data = largeLoad.filter(function (item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
                        });
                        $scope.setPagingData(data, page, pageSize);
                    },
                    function (error) {
                        $log.error("Error calling data for grid: " + error);
                    });
            } else {
                RESTFactory.readBatch(gridData).then(function (largeLoad) {
                    //                        $log.debug("largeLoad in $http: " + JSON.stringify(largeLoad));
                    $scope.setPagingData(largeLoad, page, pageSize);
                }, function (error) {
                    $log.error("Error calling data for grid: " + error);
                });

            }
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
            currentTime = new Date().getTime();

        }, true);
        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
            currentTime = new Date().getTime();
        }, true);

        $scope.gridOptions = {
            data: 'myData',
            rowHeight: 35,
            headerRowHeight: 35,
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            columnDefs: [
                {
                    field: 'name',
                    displayName: 'name',
                    enableCellEdit: false
                },
                {
                    field: 'allowance',
                    displayName: 'allowance',
                    enableCellEdit: false
                }
                ]
        };
        }]);
