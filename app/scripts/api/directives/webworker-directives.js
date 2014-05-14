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
 * Messagaes from the worker are displayed in a div.
 * Params:
 * id: id of the pre-configured worker or path to the worker's file
 * message: Message to be passed to the worker.
 *
 * @example
 <example module="AppPerformance">
 <file name="index.html">
 <p>Web Worker test</p>
 <webworker  id="" message="" />
 </file>
 </example>
 */
    .directive('webworker', ['$log',
        function ($log) {

            return {
                link: function (scope, element, attrs) {


                }
            };
        }]);
