'use strict';

angular.module('AppUtils', ['AppConfiguration'])

/**
 * @ngdoc object
 * @name UtilFactory
 * @requires $log
 *
 * @description
 * This factory provides common utilities for API functionalities.
 */
.factory('UtilFactory', ['$log',
        function ($log) {
        var factory = {};
        /**
             @function
             @param properties content of the static external properties file
             @param area group of properties
             @param property property to know the value in
             @description Deletes an item from a list.
             */
        factory.findPropertyValueByName = function (properties, area, property) {
            for (var i = 0; i < properties.length; i++) {
                if (properties[i].area == area) {
                    for (var p = 0; p < properties[i].properties.length; p++) {
                        if (properties[i].properties[p].property == property) {
                            return properties[i].properties[p].value;
                        }
                    }
                }
            }
            return null;

        };

        factory.newRandomKey = function (coll, key, currentKey) {
            var randKey;
            do {
                randKey = coll[Math.floor(coll.length * Math.random())][key];
            } while (randKey == currentKey);
            return randKey;
        }

        return factory;

    }]);
