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
    function($scope, $log, $q, Webworker) {
        'use strict';

        // some global shared variables
        var bulletSize = 15;
        $scope.count = 0;
        var _this = this;

        $scope.execTime = 0;
        $scope.starttime = 0;

        $scope.threadsNumbers = [{
            key: '1',
            value: 'Only one thread'
        }, {
            key: '2',
            value: 'Two Threads'
        }, {
            key: '4',
            value: 'Four Threads'
        }, {
            key: '6',
            value: 'Six Threads'
        }, {
            key: '8',
            value: 'Eight Threads'
        }, {
            key: '12',
            value: 'Twelve Threads (gulp!)'
        }];

        $scope.poolSize = '1';

        var sourceCanvas = document.getElementById("source");
        sourceCanvas.width = 600;
        sourceCanvas.height = 600;
        var sourceContext = sourceCanvas.getContext("2d");

        var img = new Image();
        img.onload = function() {
            sourceContext.drawImage(img, 0, 0);
        };
        img.src = "images/angularPerformance.jpg";

        var targetCanvas = document.getElementById("target");
        targetCanvas.width = sourceCanvas.width;
        targetCanvas.height = sourceCanvas.height;
        var targetContext = targetCanvas.getContext("2d");

        $scope.run = function() {
            $scope.count = 0;
            $scope.execTime = 0;

            targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

            $scope.$applyAsync(function() {
                $scope.starttime = new Date().getTime();
            });

            // render elements
            renderElements(targetCanvas.width, targetCanvas.height, sourceContext, $scope.poolSize);
        };

        this.callback = function() {

            $scope.count++;

            if ($scope.count === _this.workerTasks) {
                var currentTime = new Date().getTime();
                var diff = currentTime - $scope.starttime;
                $log.debug("Processing done: " + diff);

                $scope.$applyAsync(function() {
                    $scope.execTime = diff;
                    $scope.starttime = 0;
                });
            }
        };

        // process the image by splitting it in parts and sending it to the worker
        function renderElements(imgwidth, imgheight, context, poolSize) {

            var size = Math.round(imgwidth / poolSize);

            _this.workerTasks = 0;

            for (var t = 0; t < poolSize; t++) {

                // get the data from the image
                var imageData = context.getImageData(t * size, 0, size, imgheight);

                var work = {};
                work.imageData = imageData;
                work.bulletSize = bulletSize;
                work.xoffset = t * size;

                console.log(work);

                Webworker
                    .create(function(work) {

                        var dataAsArray = [];
                        for (var e = 0; e < work.imageData.data.length; e++) {
                            dataAsArray.push(work.imageData.data[e]);
                        }

                        var dx = Math.round(work.imageData.width / work.bulletSize);
                        var dy = Math.round(work.imageData.height / work.bulletSize);

                        for (var x = 0; x < dx; x++) {
                            for (var y = 0; y < dy; y++) {

                                var wp = {};

                                wp.x = x * work.bulletSize;
                                wp.y = y * work.bulletSize;

                                var r = 0,
                                    g = 0,
                                    b = 0,
                                    a = 0;

                                for (var i = 0; i < work.bulletSize; i++) {
                                    for (var j = 0; j < work.bulletSize; j++) {
                                        var index = (wp.x + i) * 4 + (wp.y + j) * work.imageData.width * 4;

                                        r += dataAsArray[index];
                                        g += dataAsArray[index + 1];
                                        b += dataAsArray[index + 2];
                                        a += dataAsArray[index + 3];
                                    }
                                }

                                wp.result = [Math.round(r / work.bulletSize / work.bulletSize) + ',' + Math.round(g / work.bulletSize / work.bulletSize) + ',' + Math.round(b / work.bulletSize / work.bulletSize) + ',' + Math.round(a / work.bulletSize / work.bulletSize)];

                                wp.x += work.xoffset;

                                notify(wp);
                            }
                        }
                        complete();
                    }, {
                        async: true
                    })
                    .run(work)
                    .then(function() {
                            _this.callback();
                        }, null,
                        function(wp) {
                            drawRectangle(targetContext, wp.x, wp.y, bulletSize, wp.result[0]);
                        });
                _this.workerTasks++;
            }
        }

        // draw a rectangle on the supplied context
        function drawRectangle(targetContext, x, y, bulletSize, colors) {

            targetContext.beginPath();
            targetContext.rect(x, y, bulletSize, bulletSize);
            targetContext.fillStyle = "rgba(" + colors + ")";
            targetContext.fill();
        }

    });