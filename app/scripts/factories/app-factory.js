/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf.
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 */


'use strict';

angular.module('App')

/*
 * Factory Name: 'topics'
 * This factory contains is RESTful for retrieving topics
 * from data (in this case'topics.json').
 */
.factory('topics', ['$log', 'RESTFactory',
    function ($log, RESTFactory) {

        var path = 'views/topics/topics.json';

        var factory = {};

        factory.all = function () {
            $log.debug("RESTFactory.rest_getAll");
            return RESTFactory.rest_getAll(path);
        };

        factory.get = function (id) {
            $log.debug("RESTFactory.rest_getItem", id);
            return RESTFactory.rest_getItem(path, id);
        };
        return factory;
    }])

/*
 * Factory Name: 'utils'
 * Contains methods for data finding (demo).
 *
 * findById: Util for finding an object by its 'id' property among an array
 * newRandomKey: Util for returning a randomKey from a collection that also isn't the current key
 */
.factory('utils', function () {

    return {

        //
        findById: function findById(a, id) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].id == id) {
                    return a[i];
                }
            }
            return null;
        },

        newRandomKey: function newRandomKey(coll, key, currentKey) {
            var randKey;
            do {
                randKey = coll[Math.floor(coll.length * Math.random())][key];
            } while (randKey == currentKey);
            return randKey;
        }

    };

});
