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
// If you do not use this one, use $log instead at least...
////////////////////////////////////////////////////////////////////////////

angular.module('AppLogging', ['AppREST', 'AppConfiguration'])
    .factory('StackTraceFactory',['$log',
        function ($log) {
            var factory = {};

            // "printStackTrace" is a global object.
            factory.print = printStackTrace;


            return factory;
    }])
    .factory('ErrorLogFactory',['$log', '$window', 'StackTraceFactory', 'RESTFactory',
        function( $log, $window, StackTraceFactory, RESTFactory) {

            // Log the given error to the remote server.
            function log( exception, cause ) {

                // Pass off the error to the default error handler
                // on the AngularJS logger. This will output the
                // error to the console (and let the application
                // keep running normally for the user).
                $log.error.apply( $log, arguments );

                // Now, we need to try and log the error the server.
                // --
                // NOTE: In production, it is needed
                // logic here to prevent the same client from
                // logging the same error over and over again! All
                // that would do is add noise to the log.
                try {

                    var errorMessage = exception.toString();
                    var stackTrace = StackTraceFactory.print({ e: exception });

                    // Log the JavaScript error to the server.
                    // --
                    // NOTE: In this demo, the POST URL doesn't
                    // exists and will simply return a 404.
                    var errorData = angular.toJson({
                                        errorUrl: $window.location.href,
                                        errorMessage: errorMessage,
                                        stackTrace: stackTrace,
                                        cause: ( cause || "" )
                                    });
                    RESTFactory.rest_postItem('', errorData);

                    $.ajax({
                        type: "POST",
                        url: "./javascript-errors",
                        contentType: "application/json",
                        data: angular.toJson({
                            errorUrl: $window.location.href,
                            errorMessage: errorMessage,
                            stackTrace: stackTrace,
                            cause: ( cause || "" )
                        })
                    });

                } catch ( loggingError ) {

                    // For Developers - log the log-failure.
                    $log.warn( "Error logging failed" );
                    $log.log( loggingError );

                }

            }


            // Return the logging function.
            return( log );

        }
    ])
    .provider("$exceptionHandler",{
        $get: function( errorLogService ) {

            return( errorLogService );

        }
    })




(function() {
    "use strict";

    angular
        .module( appName, [ ] )
        .config([ "$provide", function( $provide )
        {
            // Use the `decorator` solution to substitute or attach behaviors to
            // original service instance; @see angular-mocks for more examples....

            $provide.decorator( '$log', [ "$delegate", function( $delegate )
            {
                // Save the original $log.debug()
                var debugFn = $delegate.debug;

                $delegate.debug = function( )
                {
                    var args    = [].slice.call(arguments),
                        now     = DateTime.formattedNow();

                    // Prepend timestamp
                    args[0] = supplant("{0} - {1}", [ now, args[0] ]);

                    // Call the original with the output prepended with formatted timestamp
                    debugFn.apply(null, args)
                };

                return $delegate;
            }]);
        }]);

})();