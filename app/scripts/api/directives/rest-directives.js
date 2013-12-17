'use strict';

angular.module('AppREST')
/**
 * Usage:
 * <div rest rest-path="" rest-id="" rest-name="" rest-loading-text="" rest-error-text="" />
 **/
.directive('rest', ['$log', 'Restangular',
    function ($log, Restangular) {

        return {
            link: function (scope, element, attrs) {

                var defaultName = 'restData',
                    loadingSuffix = 'Loading',
                    errorSuffix = 'Error',
                    path = attrs.rest || attrs.restPath;

                scope[(attrs.restName || defaultName) + loadingSuffix] = true;
                element.html(attrs.restLoadingText || "");

                scope.$watch(function () {
                    return path + ',' + attrs.restName + ',' + attrs.restErrorText + ',' + attrs.restLoadingText;
                }, function (newVal) {
                    $log.debug('REST watch newVal:', newVal);
                    scope[(attrs.restName || defaultName) + errorSuffix] = false;

                    var object;
                    if (attrs.restId) {
                        object = Restangular.one(path, attrs.restId);
                    } else {
                        object = Restangular.one(path);
                    }

                    object.get().then(function (data) {
                        $log.debug('get data', data);
                        element.html("");
                        scope[attrs.restName || defaultName] = data;
                        scope[(attrs.restName || defaultName) + loadingSuffix] = false;
                    }, function errorCallback() {
                        element.html(attrs.restErrorText || "");
                        scope[(attrs.restName || defaultName) + loadingSuffix] = false;
                        scope[(attrs.restName || defaultName) + errorSuffix] = true;
                    });
                });
            }
        };
    }]);
