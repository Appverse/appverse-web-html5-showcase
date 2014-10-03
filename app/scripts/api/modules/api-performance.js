'use strict';

/**
 * @ngdoc module
 * @name AppPerformance
 * @requires AppConfiguration
 * @description
 * The AppPerformance provides services to handle usage of several performance elements:
 * 1-Webworkers. Multithreaded-parallelized execution of tasks separated of the main JavaScript thread.
 * 2-High Performance UI directives support.
 */

angular.module('AppPerformance', ['AppConfiguration', 'ngGrid'])

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
 *                             _______
 *                            |       |-> thread 1
 * USER -> message -> task -> | pool  |-> thread 2
 *                            |_______|-> thread N
 */
    .factory('WebWorkerPoolFactory', ['$log', '$q', 'PERFORMANCE_CONFIG',
        function ($log, $q, PERFORMANCE_CONFIG) {

            var factory = {
                _poolSize: PERFORMANCE_CONFIG.webworker_pooled_threads,
                _authorizedWorkersOnly: PERFORMANCE_CONFIG.webworker_authorized_workers_only,
                _workersDir: PERFORMANCE_CONFIG.webworker_directory,
                _workersList: PERFORMANCE_CONFIG.webworker_authorized_workers,
                _resultMessage: ''
            };

            $log.debug("Initializated webworkers factory preconfigured values." );
            $log.debug("Default pool size: " + factory._poolSize);
            $log.debug("Are only authorized preconfigured workers? " + factory._authorizedWorkersOnly);
            $log.debug("The folder for webworkers in the app: " + factory._workersDir);
            $log.debug("Number of members in the workers list: " + factory._workersList.length);

            /**
             * @ngdoc method
             * @name AppPerformance.service:WebWorkerFactory#runTasksGroup
             * @methodOf AppPerformance.service:WebWorkerFactory
             * @param {number} workerData WorkerData object with information of the task to be executed
             * @param {object} workerTasks Array with a group of WorkerTask objects for the same WorkerData
             * @param {string} params Optional Parameters to alter each worker in the pool
             * @description
             * Runs a group of parallelized tasks 
             * Run a set of workers according to the pre-defined data in configuration (id, type, size in pool and worker file).
             * Pe-definition in configuration is mandatory.
             * The group of tasks are up to the caller.
             */
            factory.runParallelTasksGroup = function (workerData, workerTasks, params) {
                this.workerData = workerData;


                $log.debug("Started parallelized execution for worker: ");
                $log.debug(workerData.toString());


                //Initializes the pool with the indicated size for that worker group
                var pool = new factory.WorkerPool(this.workerData.poolSize);
                pool.init();

                //Create a worker task for
                if(workerTasks && workerTasks.length > 0){
                    // iterate through all the parts of the image
                    for (var x = 0; x < workerTasks.length; x++) {
                        var workerTask = workerTasks[x];

                        pool.addWorkerTask(workerTask);
                    }
                }

                return factory._resultMessage;
            };


            /**
             * @ngdoc method
             * @name AppPerformance.service:WebWorkerFactory#passMessage
             * @methodOf AppPerformance.service:WebWorkerFactory
             * @param {number} id of the called worker
             * @param {object} function as callback
             * @param {string} message to be passed to the worker
             * @description
             * Execute a task in a worker.
             * The group of task is the same as the number indicated in the pool size for that pre-configured worker.
             */
            factory.runTask = function (workerId, message, callback) {


                var pool = new WorkerPool(factory._poolSize);
                pool.init();

                /*
                 If only workers in the configuration file are allowed.
                 No fallback needed.
                 */
                var workerData;
                var workerTask;
                if(factory._authorizedWorkersOnly){
                    if(workerId){
                        //Get data from configuration for the worker from the provided ID
                        workerData = getWorkerFromId(workerId);
                    }else{
                        //NO VALID WORKER ID ERROR
                        $log.error("NO VALID WORKER ID ERROR");
                    }
                }else{
                    //If any provided worker is allowed the workerId arg is the complete path to the worker file
                    //The ID is not important here
                    if(workerId){
                        workerData = new WorkerData(1001, 'dedicated', workerId)
                    }else{
                        //NO VALID WORKER ID ERROR
                        $log.error("NO VALID WORKER ID ERROR");
                    }
                }

                if(workerData) {
                    pool = new WorkerPool(workerData.poolSize);
                    /*
                     Create the worker task for the pool (only one task, passed N times):
                     workerName: File of the worker
                     callback: Register the supplied function as callback
                     message: The last argument will be used to send a message to the worker
                     */
                    workerTask = new WorkerTask(workerData, callback, message);
                    // Pass the worker task object to the execution pool.
                    // The default behavior is create one task for each thread in the pool.
                    for(var i = 0; i < factory._poolSize; i++){
                        pool.addWorkerTask(workerTask);
                    }
                }else{
                    //NO WORKER DATA ERROR
                    $log.error("NO WORKER DATA ERROR");
                }


                //return _resultMessage;
            };


            factory.WorkerPool = function(poolSize) {
                var _this = this;
                if(!poolSize) {
                    this.size = factory._poolSize;
                }else{
                    this.size = poolSize;
                }

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
                    _this.workerTask = workerTask

                    //Create a new web worker
                    if (_this.workerTask.script!= null) {
                        /*
                         Creation of workers.
                         For both dedicated and shared workers, you can also attach to the
                         message event handler event type by using the addEventListener method.
                         */
                        if(workerTask.type == PERFORMANCE_CONFIG.webworker_dedicated_literal){
                            var worker = new Worker(_this.workerTask.script);
                            worker.addEventListener('message', _this.OnWorkerMessageHandler, false);
                            worker.postMessage(_this.workerTask.startMessage);
                        }else if(workerTask.type == PERFORMANCE_CONFIG.webworker_shared_literal){
                            var worker = new SharedWorker(_this.workerTask.script);
                            worker.port.addEventListener('message', _this.OnWorkerMessageHandler, false);
                            worker.port.postMessage(_this.workerTask.startMessage);
                        }else{
                            //NO TYPE ERROR
                            $log.error("NO VALID WORKER TYPE");
                        }
                    }
                }

                //We assume we only get a single callback from a worker as a handler
                //It also indicates the end of this worker.
                _this.OnWorkerMessageHandler = function (evt) {
                    // pass to original callback
                    _this.workerTask.callback(evt);

                    // We should use a separate thread to add the worker
                    _this.parentPool.freeWorkerThread(_this);
                }
            };


            //The task to run
            factory.WorkerTask = function (workerData, callback, msg) {
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
            function WorkerData(workerId, type, poolSize, worker) {
                this.id = workerId;
                this.type = type;
                this.poolSize = poolSize;
                this.file = worker;
            };

            WorkerData.prototype.toString = function(){
                return "ID: " + this.id + "|TYPE: " + this.type + "|POOL SIZE: " + this.poolSize + "|FILE: " + this.file;

            }

            //Extract worker information from configuration
            factory.getWorkerFromId = function (workerId, poolSize){
                this.id = workerId;
                this.type = '';
                this.poolSize = poolSize;
                this.file = '';

                for(var i = 0; i < factory._workersList.length; i++) {
                    if(factory._workersList[i].id === workerId){
                        this.type = factory._workersList[i].type;
                        if(!this.poolSize || this.poolSize == 0){
                            this.poolSize = factory._workersList[i].poolSize;
                        }else{
                            this.poolSize = poolSize;
                        }

                        this.file = factory._workersDir + factory._workersList[i].file;
                        break;
                    }
                }

                var workerData = new WorkerData(this.id, this.type, this.poolSize, this.file);

                return workerData
            }

            return factory;
        }
    ])