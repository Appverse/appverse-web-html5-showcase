'use strict';

angular.module('AppPerformance')
/**
 * @ngdoc directive
 * @name AppPerformance.directive:webworker
 * @restrict AE
 *
 * @description
 * Establishes comm with messages to a selected web worker.
 * Allows send messages to the worker and receive results from.
 * Messages from the worker are displayed in a div.
 * Params:
 * id: id of the pre-configured worker or path to the worker's file
 * message: Message to be passed to the worker.
 *
 * @example
 <example module="AppPerformance">
 <file name="index.html">
 <p>Web Worker test</p>
 <webworker  id="101" message="Hans Walter" template=""/>
 </file>
 </example>
 */
    .directive('webworker', ['$log', 'WebWorkerFactory', 'PERFORMANCE_CONFIG',
        function ($log, WebWorkerFactory, PERFORMANCE_CONFIG) {

            return {
                restrict: 'E', //E = element, A = attribute, C = class, M = comment
                scope: {
                    //(required) set the worker id in configuration or the complete path if it is not included in config.
                    workerid: '@',
                    //(required) set the message to be passed to the worker
                    message: '@',
                    //(optional) custom template to render the received message from the worker
                    template: '@'
                },
                priority: 1000,
                terminal: true,
                compile: function(element, attr, linker) {

                },
                link: function postLink(scope, element, attrs) {
                    var workerid = attrs.id;
                    var passedMessage = attrs.message;
                    var template = attrs.template;

                    scope.$watch(function () {
                        return WebWorkerFactory._resultMessage;
                    }, function (newVal) {
                        $log.debug('Cache watch {' + name + '}:', newVal);
                        scope.messageFromWorker = WebWorkerFactory._resultMessage;
                    });

                    scope.$watch('message', function (value) {
                        init(value); // set defaults
                        compileTemplate(); // gets the template and compile the desired layout

                    });


//                    scope.$watch(function () {
//                        return CacheFactory.getScopeCache().get(name);
//                    }, function (newVal) {
//                        $log.debug('Cache watch {' + name + '}:', newVal);
//                        scope[name] = CacheFactory.getScopeCache().get(name);
//                    });
//
//                    scope.$watch(name, function (newVal) {
//                        $log.debug('Cache watch {' + name + '}:', newVal);
//                        CacheFactory.getScopeCache().put(name, scope[name]);
//                    });



                    /**
                     * @function
                     * @description
                     * Set defaults into the scope object
                     */
                    function init(message) {
                        scope.workerid = workerid;
                        scope.template = template || PERFORMANCE_CONFIG.webworker_Message_template;
                        initWorker(scope.workerid, message);
                    };

                    /**
                     * @function
                     * @description
                     * Gets the message from the worker.
                     */
                    function initWorker(workerid, message) {
                        WebWorkerFactory.runTask(workerid, message);
                        var messageFromWorker = WebWorkerFactory._resultMessage;

                        if (messageFromWorker) {
                            scope.messageFromWorker = messageFromWorker;
                        }
                    }

                    /**
                     * @function
                     * @description
                     * Gets the template and compile the desired layout.
                     * Based on $compile, it compiles a piece of HTML string or DOM into the retrieved
                     * template and produces a template function, which can then be used to link scope and
                     * the template together.
                     */
                    function compileTemplate() {
                        $http.get(scope.template, {
                            //This allows you can get the template again by consuming the
                            //$templateCache service directly.
                            cache: $templateCache
                        })
                            .success(function (html) {
                                element.html(html);
                                $compile(element.contents())(scope);
                            });
                    };


                    $scope.$on('$destroy', function(event) {

                    });
                }
            };
        }]);




