////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// LOGGING MODULE (AppLogging)
////////////////////////////////////////////////////////////////////////////
// The Logging module handles several types of logging.
// Client side is based on $log (service in module ng).
// It includes sending of log events to server-side REST service.
// WARNING
// IT IS STRONGLY RECOMMENDED USING THIS LOG IMPLEMENTATION
// NEVER directly use console.log() to log debugger messages.
// If you do not use this one, use $log instead al least...
////////////////////////////////////////////////////////////////////////////

angular.module('AppLogging', ['AppREST', 'AppConfiguration'])
    .factory('RESTFactory',['$log', 'Restangular',
        function ($log, Restangular) {
            var factory = {};



            return factory;
    }]);