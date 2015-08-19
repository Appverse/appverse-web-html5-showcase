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
angular.module('App.Controllers')

.controller('imageWebworkerController',
    function ($scope, $log, $q, WebWorkerPoolFactory) {

    'use strict';

    // some global shared variables
    var targetContext;
    var bulletSize = 20;
    var total = 0;
    $scope.count = 0;
    var _this = this;

    $scope.execTime = 0;
    $scope.starttime = 0;

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

    $scope.poolSize = '1';

    $scope.run = function () {
        total = 0;
        $scope.count = 0;
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

            $scope.$apply(function () {
                $scope.starttime = new Date().getTime();
            });

            // render elements
            renderElements(imgwidth, imgheight, $("#source").get()[0], $scope.poolSize);
        });
    };

    // defines a workpacke object that can be sent to the worker
    function WorkPackage() {
        this.data = [];
        this.pixelCount = 0;
        this.colors = 0;
        this.x = 0;
        this.y = 0;

        this.result = [0, 0, 0];
    }

    this.callback = function (event) {

        var wpArray = event.data;

        for (var i = 0; i < wpArray.length; i++) {
            var wp = wpArray[i];

            drawRectangle(targetContext, wp.x, wp.y, bulletSize, wp.result[0]);
        }

        $scope.count++;

        if ($scope.count === _this.workerTasks.length) {
            var currentTime = new Date().getTime();
            var diff = currentTime - $scope.starttime;
            $log.debug("Processing done: " + diff);

            $scope.$apply(function () {
                $scope.execTime = diff;
                $scope.starttime = 0;
            });
        }
    };

    // process the image by splitting it in parts and sending it to the worker
    function renderElements(imgwidth, imgheight, image, poolSize) {
        // determine image grid size
        var nrX = Math.round(imgwidth / bulletSize);
        var nrY = Math.round(imgheight / bulletSize);

        // how much to process
        total = nrX * nrY;

        _this.wTask = null;
        _this.poolSize = poolSize;
        _this.workerTasks = [];
        _this.workerData = new WebWorkerPoolFactory.getWorkerFromId('w1', poolSize);

        var wpArray = [];

        // iterate through all the parts of the image
        for (var x = 0; x < nrX; x++) {
            for (var y = 0; y < nrY; y++) {
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
                var wp = new WorkPackage();
                wp.colors = 5;
                wp.data = dataAsArray;
                wp.pixelCount = bulletSize * bulletSize;
                wp.x = x;
                wp.y = y;

                wpArray.push(wp);

                if (wpArray.length > Math.floor(total / poolSize) || x * y === (nrX - 1) * (nrY - 1)) {
                    //Create a new task for the worker pool and push it into the group
                    _this.wTask = new WebWorkerPoolFactory.WorkerTask(_this.workerData, _this.callback, wpArray);
                    _this.workerTasks.push(_this.wTask);
                    wpArray = [];
                }
            }
        }

        //Call to the worker pool passing the group of tasks for the worker
        WebWorkerPoolFactory.runParallelTasksGroup(_this.workerData, _this.workerTasks);
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

})
