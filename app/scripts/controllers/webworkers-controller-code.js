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
/*globals notify,complete */
angular.module('App.Controllers')

.controller('imageWebworkerController',
    function ($scope, $log, $q, Webworker) {
        'use strict';

        $scope.radiuses = [2, 3, 5, 8];
        $scope.radius = 3;

        var _this = this;

        $scope.execTime = 0;
        $scope.starttime = 0;

        $scope.threadsNumbers = [1, 2, 4, 6, 8, 10];
        $scope.poolSize = 1;

        var sourceCanvas = document.getElementById("source");
        sourceCanvas.width = 600;
        sourceCanvas.height = 600;
        var sourceContext = sourceCanvas.getContext("2d");

        var img = new Image();
        img.onload = function () {
            sourceContext.drawImage(img, 0, 0);
        };
        img.src = "images/angularPerformance.jpg";

        var targetCanvas = document.getElementById("target");
        targetCanvas.width = sourceCanvas.width;
        targetCanvas.height = sourceCanvas.height;
        var targetContext = targetCanvas.getContext("2d");

        $scope.width = sourceCanvas.width;

        $scope.run = function () {
            $scope.count = 0;
            $scope.execTime = 0;

            targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

            $scope.$applyAsync(function () {
                $scope.starttime = new Date().getTime();
            });

            // render elements
            renderElements(targetCanvas.width, targetCanvas.height, sourceContext, $scope.poolSize);
        };

        this.callback = function () {

            if ($scope.count === sourceCanvas.width) {
                var currentTime = new Date().getTime();
                var diff = currentTime - $scope.starttime;
                $log.debug("Processing done: " + diff);

                $scope.execTime = diff;
                $scope.starttime = 0;
                $scope.$applyAsync();
            }
        };

        // process the image by splitting it in parts and sending it to the worker
        function renderElements(imgwidth, imgheight, context, poolSize) {

            var size = Math.round(imgwidth / poolSize);

            _this.workerTasks = 0;

            for (var t = 0; t < poolSize; t++) {

                // get the data from the image
                var imageData = context.getImageData(t * size, 0, size, imgheight);

                var dataAsArray = [];
                for (var e = 0; e < imageData.data.length; e++) {
                    dataAsArray.push(imageData.data[e]);
                }

                var work = {};
                work.data = dataAsArray;
                work.radius = $scope.radius;
                work.xoffset = t * size;
                work.size = size;
                work.width = imageData.width;
                work.height = imageData.height;

                Webworker
                    .create(function (work) {

                        var r = work.radius;
                        var rs = Math.ceil(r * 2.57);

                        for (var i = 0; i < work.width; i++) {

                            var wpa = [];

                            for (var j = 0; j < work.height; j++) {

                                var red = 0,
                                    g = 0,
                                    b = 0,
                                    a = 0,
                                    wsum = 0;

                                var wp = {};

                                wp.x = i;
                                wp.y = j;

                                // http://blog.ivank.net/fastest-gaussian-blur.html
                                for (var ix = i - rs; ix < i + rs + 1; ix++) {
                                    for (var iy = j - rs; iy < j + rs + 1; iy++) {
                                        var x = Math.min(work.width - 1, Math.max(0, ix));
                                        var y = Math.min(work.height - 1, Math.max(0, iy));
                                        var dsq = (iy - j) * (iy - j) + (ix - i) * (ix - i);
                                        var wght = Math.exp(-dsq / (2 * r * r)) / (Math.PI * 2 * r * r);
                                        red += work.data[(y * work.width + x) * 4] * wght;
                                        g += work.data[(y * work.width + x) * 4 + 1] * wght;
                                        b += work.data[(y * work.width + x) * 4 + 2] * wght;
                                        a += work.data[(y * work.width + x) * 4 + 3] * wght;
                                        wsum += wght;
                                    }
                                }
                                wp.result = Math.round(red / wsum) + ',' + Math.round(g / wsum) + ',' + Math.round(b / wsum) + ',' + Math.round(a / wsum / 25.5) / 10;

                                wp.x += work.xoffset;

                                wpa.push(wp);
                            }
                            notify(wpa);
                        }
                        complete();
                    }, {
                        async: true
                    })
                    .run(work)
                    .then(function () {
                            _this.callback();
                        }, null,
                        function (wpa) {
                            for (var j = 0; j < wpa.length; j++) {
                                var wp = wpa[j];
                                targetContext.fillStyle = "rgba(" + wp.result + ")";
                                targetContext.fillRect(wp.x, wp.y, 1, 1);
                            }
                            $scope.count++;
                            $scope.$applyAsync();
                        });
                _this.workerTasks++;
            }
        }
    });
