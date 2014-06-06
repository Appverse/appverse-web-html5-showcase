'use strict';

/**
 * @ngdoc module
 * @name AppDetection
 * @description
 * Provides browser and network detection.
 */
angular.module('AppDetection', [])

.run(['$log', 'Detection', '$rootScope', '$window',
    function ($log, Detection, $rootScope, $window) {

        $log.info('AppDetection run');

        if ($window.addEventListener) {
            $window.addEventListener("online", function () {
                $log.debug('detectionController online');
                Detection.isOnline = true;
                $rootScope.$digest();
            }, true);

            $window.addEventListener("offline", function () {
                $log.debug('detectionController offline');
                Detection.isOnline = false;
                $rootScope.$digest();
            }, true);
        } else {
            $log.warn('Detection module: $window.addEventListener not supported.');
        }

        if ($window.applicationCache) {
            $window.applicationCache.addEventListener("error", function () {
                $log.debug("Error fetching manifest: a good chance we are offline");
            });
        } else {
            $log.warn('Detection module: $window.applicationCache not supported.');
        }

        if (window.addEventListener) {
            window.addEventListener("goodconnection", function () {
                $log.debug('detectionController goodconnection');
                Detection.isOnline = true;
                $rootScope.$digest();
            });

            window.addEventListener("connectiontimeout", function () {
                $log.debug('detectionController connectiontimeout');
                Detection.isOnline = false;
                $rootScope.$digest();
            });

            window.addEventListener("connectionerror", function () {
                $log.debug('detectionController connectionerror');
                Detection.isOnline = false;
                $rootScope.$digest();
            });

            window.addEventListener("onBandwidthStart", function () {
                $log.debug('detectionController onBandwidthStart');
                Detection.bandwidthStartTime = new Date();
            });

            window.addEventListener("onBandwidthEnd", function (e) {
                $log.debug('detectionController onBandwidthEnd');
                var contentLength = parseInt(e.data.getResponseHeader('Content-Length'), 10);
                var delay = new Date() - Detection.bandwidthStartTime;
                Detection.bandwidth = parseInt((contentLength / 1024) / (delay / 1000));
                setTimeout(function () {
                    $rootScope.$digest();
                });
            });
        } else {
            $log.warn('Detection module: window.addEventListener not supported.');
        }
    }])

/**
 * @ngdoc service
 * @name AppDetection.provider:Detection
 * @description
 * Contains methods for browser and network detection.
 */
.provider('Detection',
    function () {

        if (typeof Unity === 'undefined' || Unity.System.GetOSInfo() === null) {
            this.hasAppverseMobile = false;
        } else {
            this.hasAppverseMobile = true;
        }

        /**
         * Code adapted from http://detectmobilebrowser.com
         **/
        var a = navigator.userAgent || navigator.vendor || window.opera;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            this.isMobileBrowser = true;
        } else {
            this.isMobileBrowser = false;
        }

        if (this.hasAppverseMobile || this.isMobileBrowser) {
            $.ajax({
                async: false,
                url: "bower_components/angular-touch/angular-touch.js",
                dataType: 'script'
            });
            $.ajax({
                async: false,
                url: "bower_components/angular-animate/angular-animate.js",
                dataType: 'script'
            });
            $.ajax({
                async: false,
                url: "bower_components/angular-route/angular-route.js",
                dataType: 'script'
            });
            $.ajax({
                async: false,
                url: "scripts/api/angular-jqm.js",
                dataType: 'script'
            });
        } else {
            angular.module('jqm', []);
        }

        var fireEvent = function (name, data) {
            var e = document.createEvent("Event");
            e.initEvent(name, true, true);
            e.data = data;
            window.dispatchEvent(e);
        };

        var fetch = function (url, callback) {
            var xhr = new XMLHttpRequest();

            var noResponseTimer = setTimeout(function () {
                xhr.abort();
                fireEvent("connectiontimeout", {});
            }, 5000);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }

                if (xhr.status === 200) {
                    fireEvent("goodconnection", {});
                    clearTimeout(noResponseTimer);
                    if (callback) {
                        callback(xhr.responseText);
                    }
                } else {
                    fireEvent("connectionerror", {});
                }
            };
            xhr.open("GET", url);
            xhr.send();
        };

        this.isOnline = window.navigator.onLine;
        this.isPollingOnlineStatus = false;

        /**
         * @ngdoc method
         * @name AppDetection.provider:Detection#testOnlineStatus
         * @methodOf AppDetection.provider:Detection
         * @param {String} path The item URL
         * @description Tries to fetch a file on the server and fire events for fail and success.
         */
        this.testOnlineStatus = function () {
            fetch("resources/detection/ping.json");
        };

        /**
         * @ngdoc method
         * @name AppDetection.provider:Detection#startPollingOnlineStatus
         * @methodOf AppDetection.provider:Detection
         * @param {number} interval Time in milliseconds
         * @description Tries to fetch a file on the server at regular intervals and fire events for fail and success.
         */
        this.startPollingOnlineStatus = function (interval) {
            this.isPollingOnlineStatus = setInterval(this.testOnlineStatus, interval);
        };

        this.stopPollingOnlineStatus = function () {
            clearInterval(this.isPollingOnlineStatus);
            this.isPollingOnlineStatus = false;
        };

        this.bandwidth = 0;
        this.isPollingBandwidth = false;

        this.testBandwidth = function () {
            var jsonUrl = "resources/detection/bandwidth.json";
            fireEvent("onBandwidthStart");
            var ajaxResponse = $.ajax({
                cache: false,
                async: false,
                url: jsonUrl,
                dataType: "json"
            });
            fireEvent("onBandwidthEnd", ajaxResponse);
        };

        this.startPollingBandwidth = function (interval) {
            this.isPollingBandwidth = setInterval(this.testBandwidth, interval);
        };

        this.stopPollingBandwidth = function () {
            clearInterval(this.isPollingBandwidth);
            this.isPollingBandwidth = false;
        };

        this.$get = function () {
            return this;
        };

        function addConfigFromJSON(jsonUrl) {

            var ajaxResponse = $.ajax({
                async: false,
                url: jsonUrl,
                dataType: "json"
            });

            var jsonData = JSON.parse(ajaxResponse.responseText);

            angular.forEach(jsonData, function (constantObject, constantName) {
                var appConfigObject = appConfigTemp[constantName];

                if (appConfigObject) {
                    angular.forEach(constantObject, function (propertyValue, propertyName) {
                        appConfigObject[propertyName] = propertyValue;
                    });
                    appConfigTemp[constantName] = appConfigObject;
                } else {
                    appConfigTemp[constantName] = constantObject;
                }
            });
        }

        var appConfigTemp = {};

        angular.forEach(angular.module('AppConfigDefault')._invokeQueue, function (element) {
            appConfigTemp[element[2][0]] = element[2][1];
        });

        if (this.hasAppverseMobile) {
            addConfigFromJSON('resources/configuration/appversemobile-conf.json');
        } else if (this.isMobileBrowser) {
            addConfigFromJSON('resources/configuration/mobilebrowser-conf.json');
        }

        addConfigFromJSON('resources/configuration/environment-conf.json');

        var appConfiguration = angular.module('AppConfiguration');

        angular.forEach(appConfigTemp, function (propertyValue, propertyName) {
            appConfiguration.constant(propertyName, propertyValue);
        });
    });
