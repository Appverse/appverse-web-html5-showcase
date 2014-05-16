'use strict';

/*
 * Controllers for cache demo.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('appverseClientIncubatorApp')

    .controller('performanceController', ['$log',
        function ($log) {
            $log.debug('performanceController loading');
        }])


    .controller('imageWebworkerController', ['$log', '$q', 'WebWorkerFactory', 'PERFORMANCE_CONFIG',
        function ($log, $q, WebWorkerFactory, PERFORMANCE_CONFIG) {

            // some global shared variables
            var targetContext;
            var worker;
            var bulletSize = 20;
            var total = 0;
            var count = 0;
            var starttime = 0;

//            var pool = new Pool(8);
//            pool.init();



            // start processing when the document is loaded.
            $(document).ready(function () {

                // wait for the image to be loaded, before we start processing it.
                $("#source").load(function () {

                    // determine size of image
                    var imgwidth = $(this).width();
                    var imgheight = $(this).height();

                    // create a canvas and make context available
                    var targetCanvas = createTargetCanvas(imgwidth, imgheight);
                    targetContext = targetCanvas.getContext("2d");

                    // render elements
                    starttime = new Date().getTime();
                    renderElements(imgwidth, imgheight, $(this).get()[0]);
                });
            });

            // defines a workpacke object that can be sent to the worker
            function workPackage() {
                this.data = [];
                this.pixelCount = 0;
                this.colors = 0;
                this.x = 0;
                this.y = 0;

                this.result = [0, 0, 0];
            }

            function callback(event) {

                count++;
                //var defer = $q.defer();

                if (count == total) {
                    var currentTime = new Date().getTime();
                    console.log("Processing done: " + (currentTime - starttime));
                }
                //defer.resolve(event.data);

                var wp = event.data;

                // get the colors
                var colors = wp.result;

                drawRectangle(targetContext, wp.x, wp.y, bulletSize, colors[0]);

            }

            // process the image by splitting it in parts and sending it to the worker
            function renderElements(imgwidth, imgheight, image) {
                // determine image grid size
                var nrX = Math.round(imgwidth / bulletSize);
                var nrY = Math.round(imgheight / bulletSize);

                // how much to process
                total = nrX * nrY;

                var workerTasks = new Array();


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
                        var data = context2.getImageData(0, 0, bulletSize, bulletSize).data
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

                        //var workerTask = new WorkerTask('extractMainColor.js',callback,wp);
                        //pool.addWorkerTask(workerTask);

                        //Create a new task for the worker pool and push it into the group
                        var wTask = new WebWorkerFactory.WorkerTask('w1', callback, wp);
                        workerTasks.push(wTask);

                    }
                }

                //Call to the worker pool passing the group of tasks for the worker
                WebWorkerFactory.runTasksGroup('w1', workerTasks);
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

    .controller('restWebworkerController', ['$log',
        function ($log) {
            $log.debug('restWebworkerController loading');
        }])