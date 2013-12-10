'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// LOGGING MODULE (AppLogging)
////////////////////////////////////////////////////////////////////////////
// The Logging module handles several tasks with logging:
// 1-It applies a decorator on native $log service in module ng.
// 2-It includes sending of log events to server-side REST service.
//
// WARNING
// IT IS STRONGLY RECOMMENDED USING THIS LOG IMPLEMENTATION
// NEVER directly use console.log() to log debugger messages.
// If you do not use this one, use $log instead at least...
////////////////////////////////////////////////////////////////////////////
// SERVER SIDE LOG
// To handle JavaScript errors, we needed to intercept the core AngularJS error handling and
// add a server-side communication aspect to it.
////////////////////////////////////////////////////////////////////////////

angular.module('AppLogging', ['AppREST', 'AppConfiguration'])

//////////////////////////////////////////////////////////////////////////////////////
////////////////////// DECORATOR WAY//////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/*
     Decorate log
     The $provide (which provides all angular services) needs 2 parameters to “decorate” something:
     1) the target service;
     2) the callback to be executed every time someone asks for the target.

     This way, we are telling in config time to Angular that every time a service/controller/directive asks
     for $log instance, Angular will provide the result of the callback. As you can see, we are passing the original
     $log and formattedLogger (the API implementation) to the callback, and then, he returns a formattedLogger
     factory instance.
    */
.config(["$provide",
    function ($provide) {
        $provide.decorator("$log", function ($delegate, formattedLogger) {
            return formattedLogger($delegate);
        });
    }])

.factory("formattedLogger", ["LOGGING_CONFIG",
    function (LOGGING_CONFIG) {
        return function ($delegate) {

            /**
             * @function DateTime
             * @param date The date to be formatted
             * @param format The format of the returned date
             * @description It formats a date
             */
            function DateTime(date, format) {
                var date = date || new Date();
                var format = format || LOGGING_CONFIG.LogDateTimeFormat;

                function pad(value) {
                    return (value.toString().length < 2) ? '0' + value : value;
                }

                return format.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
                    switch (fmtCode) {
                    case 'Y':
                        return date.getFullYear();
                    case 'M':
                        return pad(date.getMonth() + 1);
                    case 'd':
                        return pad(date.getDate());
                    case 'h':
                        return pad(date.getHours());
                    case 'm':
                        return pad(date.getMinutes());
                    case 's':
                        return pad(date.getSeconds());
                    case 'z':
                        return pad(date.getMilliseconds());
                    default:
                        throw new Error('Unsupported format code: ' + fmtCode);
                    }
                });
            }

            /**
             * @function handleLogMessage
             * @param logLevel
             * @param callback
             * @description It arranges the log message and send it to the server registry.
             */
            function handleLogMessage(logLevel, callback) {
                try {
                    /*
                    Compose the message
                     */
                    if (logLevel === 'warn') {
                        $delegate.warn(arguments);
                    } else if (logLevel === 'debug') {
                        $delegate.debug(arguments);
                    } else if (logLevel === 'info') {
                        $delegate.info(arguments);
                    } else if (logLevel === 'error') {
                        $delegate.error(arguments);
                    } else if (logLevel === 'log') {
                        $delegate.log(arguments);
                    }

                    var errorMessage = logLevel + "|" + LOGGING_CONFIG.CustomLogPreffix + ": " + DateTime() + "|" + arguments.toString();
                    console.log(arguments);
                    console.log(errorMessage);
                    /*
                    If sending log messages to server is enabled this is sent via REST.
                    */
                    if (LOGGING_CONFIG.ServerEnabled) {
                        // Log the JavaScript error to the server.
                        var errorData = angular.toJson({
                            errorUrl: $window.location.href,
                            errorMessage: errorMessage,
                            cause: (cause || "")
                        });
                        /*
                         REST context to record log message is needed.
                         */
                        //                        RESTFactory.rest_postItem('', errorData);
                    }

                } catch (loggingError) {
                    // ONLY FOR DEVELOPERS - log the log-failure.
                    console.warn("Error logging failed");
                    console.error(loggingError);
                }

            }

            /*
            Our calls depend on the $log service methods(http://docs.angularjs.org/api/ng.$log)

            debug() Write a debug message
            error() Write an error message
            info() Write an information message
            log() Write a log message
            warn() Write a warning message
             */
            //            for (var prop in obj) {
            //                if (obj.hasOwnProperty(prop)) {
            //                    // or if (Object.prototype.hasOwnProperty.call(obj,prop)) for safety...
            //                    alert("prop: " + prop + " value: " + obj[prop])
            //                }
            //            }
            return {
                log: function () {
                    if (LOGGING_CONFIG.EnabledLogLevel) {
                        handleLogMessage('log');
                    }
                },
                info: function () {
                    if (LOGGING_CONFIG.EnabledInfoLevel) {
                        handleLogMessage('info');
                    }
                },
                error: function () {
                    if (LOGGING_CONFIG.EnabledErrorLevel) {
                        handleLogMessage('error');
                    }
                },
                warn: function () {
                    if (LOGGING_CONFIG.EnabledWarnLevel) {
                        handleLogMessage('warn');
                    }
                },
                debug: function () {
                    if (LOGGING_CONFIG.EnabledDebugLevel) {
                        handleLogMessage('debug');
                    }
                }
            };
        };
    }]);
