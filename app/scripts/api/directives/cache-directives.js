'use strict';

angular.module('AppCache')
/**
 * @ngdoc directive
 * @name AppCache.directive:cache
 * @restrict B
 * @requires $log
 * @requires AppCache.factory:CacheFactory
 * 
 * @description
 * Use this directive to inject directly in dom nodes caching features for values.
 * 
 * 
 * @example
 <example module="AppCache">
    <file name="index.html">
        <div cache="name" />
        <div cache cache-name="name" />
    </file>
</example>
 */
.directive('cache', ['$log', 'CacheFactory',
    function ($log, CacheFactory) {

        return {
            link: function (scope, element, attrs) {

                var name = attrs.cache || attrs.cacheName;

                scope.$watch(function () {
                    return CacheFactory.getScopeCache().get(name);
                }, function (newVal) {
                    $log.debug('Cache watch {' + name + '}:', newVal);
                    scope[name] = CacheFactory.getScopeCache().get(name);
                });

                scope.$watch(name, function (newVal) {
                    $log.debug('Cache watch {' + name + '}:', newVal);
                    CacheFactory.getScopeCache().put(name, scope[name]);
                });
            }
        };
    }]);
