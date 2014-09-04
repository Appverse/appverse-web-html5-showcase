'use strict';

angular.module('AppREST')
/**
 * @ngdoc directive
 * @name AppREST.directive:rest
 * @restrict A
 *
 * @description
 * Retrieves JSON data
 *
 * @example
 <example module="AppREST">
   <file name="index.html">
     <p>REST test</p>
     <div rest rest-path="" rest-id="" rest-name="" rest-loading-text="" rest-error-text="" />
   </file>
 </example>
 */
.directive('rest', ['$log', 'Restangular',
    function ($log, Restangular) {

        return {
            link: function (scope, element, attrs) {

                var defaultName = 'restData',
                    loadingSuffix = 'Loading',
                    errorSuffix = 'Error',
                    name = attrs.restName || defaultName,
                    path = attrs.rest || attrs.restPath;

                $log.debug('rest directive');

                scope[name + loadingSuffix] = true;
                element.html(attrs.restLoadingText || "");

                scope.$watchCollection(function () {
                    return [path, name, attrs.restErrorText, attrs.restLoadingText];
                }, function (newCollection, oldCollection, scope) {
                    $log.debug('REST watch ' + name + ':', newCollection);
                    scope[name + errorSuffix] = false;

                    var object;
                    if (attrs.restId) {
                        object = Restangular.one(path, attrs.restId);
                    } else {
                        object = Restangular.one(path);
                    }

                    object.get().then(function (data) {
                        $log.debug('get data', data);
                        element.html("");
                        scope[name] = data;
                        scope[name + loadingSuffix] = false;
                    }, function errorCallback() {
                        element.html(attrs.restErrorText || "");
                        scope[name + loadingSuffix] = false;
                        scope[name + errorSuffix] = true;
                    });
                });
            }
        };
    }]);
