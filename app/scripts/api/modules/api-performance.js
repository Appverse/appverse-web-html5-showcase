'use strict';

/**
 * @ngdoc module
 * @name AppPerformance
 * @requires AppConfiguration
 * @description
 * The AppPerformance provides services to handle usage of several performance elements:
 * 1-Webworkers. Multithreaded-parallelized execution of tasks separated of the main JavaScript thread.
 * 2-High Performance elements.
 */

angular.module('AppPerformance', ['AppConfiguration'])

    .run(['$log', 'PERFORMANCE_CONFIG',
        function ($log, PERFORMANCE_CONFIG) {

            $log.info('AppPerformance run');


        }])

/**
 * @ngdoc service
 * @name AppPerformance.service:WebWorkerFactory
 * @requires $log
 * @requires PERFORMANCE_CONFIG
 * @description
 * This factory starts a pooled multithreaded execution of a webworker.
 *                              _______
 *                             |       |-> thread
 * USER -> message -> task  -> | pool  |-> thread
 *                             |_______|-> thread
 * How to use:
 * var callback = function(event){
 *      $log.debug("The result of the worker is: " + event.data);
 * }
 * WebWorkerFactory.runTask(2, callback, "Hi")
 */
    .factory('WebWorkerFactory', ['$log', 'PERFORMANCE_CONFIG',
        function ($log, PERFORMANCE_CONFIG) {

            var factory = {
                _poolSize: PERFORMANCE_CONFIG.webworker_pooled_threads,
                _authorizedWorkersOnly: PERFORMANCE_CONFIG.webworker_authorized_workers_only,
                _workersDir: PERFORMANCE_CONFIG.webworker_directory,
                _workersList: PERFORMANCE_CONFIG.webworker_authorized_workers,
                _resultMessage: ''
            };

            /**
             * @ngdoc method
             * @name AppPerformance.service:WebWorkerFactory#passMessage
             * @methodOf AppPerformance.service:WebWorkerFactory
             * @param {number} id of the called worker
             * @param {object} function as callback
             * @param {string} message to be passed to the worker
             * @description Entry function. It passes a message to a worker.
             */
            factory.runTask = function (workerId, message, callback) {
                //var pool = new WorkerPool(factory._poolSize);
                var pool = WorkerPool.getInstance();
                pool.init();

                /*
                 If only workers in the configuration file are allowed.
                 No fallback needed.
                 */
                if(factory._authorizedWorkersOnly){
                    if(workerId){
                        //Get data from configuration for the worker from the provided ID
                        var workerData = getWorkerFromId(workerId);
                        if(workerData){
                            /*
                             Create the worker task object from passed data.
                             workerName: File of the worker
                             callback: Register the supplied function as callback
                             message: The last argument will be used to send a message to the worker
                             */
                            var workerTask = new WorkerTask(workerData, callback, message);
                            // Pass the worker task object to the execution pool
                            pool.addWorkerTask(workerTask);
                        }else{
                            //NO VALID WORKER ID
                        }
                    }
                }else{
                    //If any provided worker is allowed the workerId arg is the complete path to the worker file
                    if(workerId){
                        var workerData = new WorkerData(1001, 'dedicated', workerId)
                        var workerTask = new WorkerTask(workerData, callback, message);
                        pool.addWorkerTask(workerTask);
                    }
                }
                //return _resultMessage;
            };

            /*
            Private object
             */
            var WorkerPool = function() {
                var _this = this;
                var size = factory._poolSize;

                //Initialize some vars with default values
                this.taskQueue = [];
                this.workerQueue = [];

                //Start the thread pool. To be used by the caller.
                this.init = function() {
                    //Create the 'size' number of worker threads
                    for (var i = 0 ; i < _this.size ; i++) {
                        _this.workerQueue.push(new WorkerThread(_this));
                    }
                }


                this.addWorkerTask = function(workerTask) {
                    if (_this.workerQueue.length > 0) {
                        // get the worker from the front of the queue
                        var workerThread = _this.workerQueue.shift();
                        workerThread.run(workerTask);
                    } else {
                        // If there are not free workers the task is put in queue
                        _this.taskQueue.push(workerTask);
                    }
                }


                //Execute the queued task. If empty, put the task to the queue.
                this.freeWorkerThread = function(workerThread) {
                    if (_this.taskQueue.length > 0) {
                        // It is not put back in the queue, but it is executed on the next task
                        var workerTask = _this.taskQueue.shift();
                        workerThread.run(workerTask);
                    } else {
                        _this.taskQueue.push(workerThread);
                    }
                }

            };

            //Runner work tasks in the pool
            function WorkerThread(parentPool) {

                var _this = this;
                this.parentPool = parentPool;
                this.workerTask = {};

                //Execute the task
                this.run = function(workerTask) {
                    this.workerTask = workerTask;
                    //Create a new web worker
                    if (this.workerTask.script!= null) {
                        /*
                         Creation of workers.
                         For both dedicated and shared workers, you can also attach to the
                         message event handler event type by using the addEventListener method.
                         */
                        if(this.workerTask.type == PERFORMANCE_CONFIG.webworker_dedicated_literal){
                            var worker = new Worker(workerTask.script);
                            worker.addEventListener('message', OnWorkerMessageHandler, false);
                            worker.postMessage(workerTask.startMessage);
                        }else if(this.workerTask.type == PERFORMANCE_CONFIG.webworker_shared_literal){
                            var worker = new SharedWorker(workerTask.script);
                            worker.port.addEventListener('message', OnWorkerMessageHandler, false);
                            worker.port.postMessage(workerTask.startMessage);
                        }else{
                            //NO TYPE ERROR
                        }
                    }else{
                        //NO WORKER DEFINED ERROR
                    }
                }

                //We assume we only get a single callback from a worker as a handler
                //It also indicates the end of this worker.
                function OnWorkerMessageHandler(evt) {
                    // pass to original callback
                    _this.workerTask.callback(evt);

                    // We should use a separate thread to add the worker
                    _this.parentPool.freeWorkerThread(_this);
                }
            };

            //The task to run
            function WorkerTask(workerData, callback, msg) {
                this.script = workerData.file;
                if(callback){
                    this.callback = callback;
                }else{
                    this.callback = defaultEventHandler;
                }
                this.startMessage = msg;
                this.type = workerData.type;
            };

            /*
             Default event handler.

             */
            function defaultEventHandler(event){
                factory._resultMessage = event.data;
            }

            //Data object for a worker
            function WorkerData(workerId, type, worker) {
                this.id = workerId;
                this.type = type;
                this.file = worker;
            };

            //Extract worker information from configuration
            function getWorkerFromId(workerId){
                this.type = '';
                this.file = '';

                for(var i = 0; i < factory._workersList.length; i++) {
                    if(factory._workersList[i].id === workerId){
                        type = factory._workersList[i].type;
                        file = factory._workersDir + factory._workersList[i].file;
                        break;
                    }
                }

                var workerData = new WorkerData(workerId, type, file);

                return workerData
            }

            return factory;
        }
    ])


