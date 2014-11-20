'use strict';

/*
 * Controllers for performance demo.
 *
 */
angular.module('App.Controllers')

.controller('performanceController', ['$log',
        function ($log) {
        $log.debug('performanceController loading');
        }])


.controller('imageWebworkerController', ['$scope', '$log', '$q', 'WebWorkerPoolFactory', 'PERFORMANCE_CONFIG',
        function ($scope, $log, $q, WebWorkerPoolFactory, PERFORMANCE_CONFIG) {

        // some global shared variables
        var targetContext;
        var worker;
        var bulletSize = 20;
        var total = 0;
        var count = 0;
        var starttime = 0;
        var callback;
        var wTask;;
        var poolSize;;
        var workerTasks;
        var workerData;

        var _this = this;

        $scope.execTime = 0;

        //$scope.threadsNumbers = [1,2,4,6,8];
        $scope.threadsNumbers = [
            {
                key: '1',
                value: 'Only one thread'
            },
            {
                key: '2',
                value: 'Two Threads'
            },
            {
                key: '4',
                value: 'Four Threads'
            },
            {
                key: '6',
                value: 'Six Threads'
            },
            {
                key: '8',
                value: 'Eight Threads'
            },
            {
                key: '12',
                value: 'Twelve Threads (gulp!)'
            }
            ];

        $scope.run = function () {
            total = 0;
            count = 0;
            $("#targetCanvas").remove();
            $scope.execTime = 0;

            // determine size of image
            var img = $("#source")[0]; // Get my img elem

            $("<img/>") // Make in memory copy of image to avoid css issues
            .attr("src", $(img).attr("src"))
                .load(function () {
                    var imgwidth = this.width;
                    var imgheight = this.height;

                    // create a canvas and make context available
                    var targetCanvas = createTargetCanvas(imgwidth, imgheight);
                    targetContext = targetCanvas.getContext("2d");

                    // render elements
                    starttime = new Date().getTime();

                    renderElements(imgwidth, imgheight, $("#source").get()[0], $scope.poolSize.key);
                });
        };

        // defines a workpacke object that can be sent to the worker
        function workPackage() {
            this.data = [];
            this.pixelCount = 0;
            this.colors = 0;
            this.x = 0;
            this.y = 0;

            this.result = [0, 0, 0];
        }

        this.callback = function (event) {
            count++;

            if (count == total) {
                var currentTime = new Date().getTime();
                var diff = currentTime - starttime;
                $log.debug("Processing done: " + diff);

                $scope.$apply(function () {
                    $scope.execTime = diff;
                });
            }

            var wp = event.data;

            // get the colors
            var colors = wp.result;

            drawRectangle(targetContext, wp.x, wp.y, bulletSize, colors[0]);

        }

        // process the image by splitting it in parts and sending it to the worker
        function renderElements(imgwidth, imgheight, image, poolSize) {
            // determine image grid size
            var nrX = Math.round(imgwidth / bulletSize);
            var nrY = Math.round(imgheight / bulletSize);

            // how much to process
            total = nrX * nrY;

            //var workerTasks = new Array();
            _this.wTask = null;
            _this.poolSize = poolSize;
            _this.workerTasks = [];
            _this.workerData = new WebWorkerPoolFactory.getWorkerFromId('w1', poolSize);


            // iterate through all the parts of the image
            for (var x = 0; x < nrX; x++) {
                for (var y = 0; y < nrX; y++) {
                    // create a canvas element we use for temporary rendering
                    var canvas2 = document.createElement('canvas');
                    canvas2.width = bulletSize;
                    canvas2.height = bulletSize;
                    var context2 = canvas2.getContext('2d');
                    // render part of the image for which we want to determine the dominant color
                    context2.drawImage(image, x * bulletSize, y * bulletSize, bulletSize, bulletSize, 0, 0, bulletSize, bulletSize);

                    // get the data from the image
                    var data = context2.getImageData(0, 0, bulletSize, bulletSize).data;
                    // convert data, which is a canvas pixel array, to a normal array
                    // since we can't send the canvas array to a webworker
                    var dataAsArray = [];
                    for (var i = 0; i < data.length; i++) {
                        dataAsArray.push(data[i]);
                    }

                    // create a workpackage
                    var wp = new workPackage();
                    wp.colors = 5;
                    wp.data = dataAsArray;
                    wp.pixelCount = bulletSize * bulletSize;
                    wp.x = x;
                    wp.y = y;

                    //Create a new task for the worker pool and push it into the group
                    _this.wTask = new WebWorkerPoolFactory.WorkerTask(_this.workerData, _this.callback, wp);
                    _this.workerTasks.push(_this.wTask);

                }
            }

            //Call to the worker pool passing the group of tasks for the worker
            WebWorkerPoolFactory.runParallelTasksGroup(_this.workerData, _this.workerTasks, _this.poolSize);
        }

        // create the target canvas where the result will be rendered
        function createTargetCanvas(imgwidth, imgheight) {
            // create target canvas, with the correct size
            return $("<canvas/>")
                .attr("width", imgwidth)
                .attr("height", imgheight)
                .attr("id", "targetCanvas")
                .appendTo("#target").get()[0];
        }

        // draw a rectangle on the supplied context
        function drawRectangle(targetContext, x, y, bulletSize, colors) {

            targetContext.beginPath();
            targetContext.rect(x * bulletSize, y * bulletSize, bulletSize, bulletSize);
            targetContext.fillStyle = "rgba(" + colors + ",1)";
            targetContext.fill();
        }

        // draw a circle on the supplied context
        function drawCircle(targetContext, x, y, bulletSize, colors) {
            var centerX = x * bulletSize + bulletSize / 2;
            var centerY = y * bulletSize + bulletSize / 2;
            var radius = bulletSize / 2;

            targetContext.beginPath();
            targetContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            targetContext.fillStyle = "rgba(" + colors + ",1)";
            targetContext.fill();
        }
        }])




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
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
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
                    })

                    //                        $log.debug("largeLoad: " + JSON.stringify(dst));
                    $scope.setPagingData(dst, page, pageSize);
                }, function (error) {
                    $log.error("Error calling data for grid: " + error);
                });

            };
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

.controller('normalGridController', ['$scope', '$log', 'RESTFactory',
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

                RESTFactory.readListNoEmpty(gridData).then(
                    function (largeLoad) {
                        data = largeLoad.filter(function (item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
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

            };
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
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
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

            };
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
