'use strict';

angular.module('AppCache')
/**
 * Usage:
 * <div cache="name" />
 * <div cache cache-name="name" />
 **/
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
