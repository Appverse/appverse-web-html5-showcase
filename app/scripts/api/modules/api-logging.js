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
// add a server-side communication aspect to it. To do this, we had to override the $exceptionHandler
// provider and replace it with a custom one that POST'ed the error to the server using AJAX.
// Posting the error to the server was only half the battle; it turns out that getting the right error
// information out of a JavaScript exception object is not super easy, especially across multiple browsers.
// We use Stacktrace.js by Eric Wendelin. Stacktrace.js can take an error object and produce a
// stacktrace that works in every browser that we support. It is not a small thing!
////////////////////////////////////////////////////////////////////////////

angular.module('AppLogging', ['AppREST', 'AppConfiguration'])

//////////////////////////////////////////////////////////////////////////////////////
////////////////////// DECOTRATOR WAY//////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    /*
     Decorate log
     In this snippet, the $provide (which provides all angular services)
     needs 2 parameters to “decorate” something:
     1) the target service;
     2) the callback to be executed every time someone asks for the target.
     This way, we are telling in config time to Angular that every time a
     service/controller/directive asks for $log instance, Angular will provide
     the result of the callback. As you can see, we are passing the original
     $log and shadowLogger (our implementation) to the callback, and then,
     he returns a shadowLogger instance.
    */
    .config(["$provide",function($provide){
        $provide.decorator("$log",function($delegate, formattedLogger){
            return formattedLogger($delegate);
        });
    }])

    .factory("formattedLogger",function(){
        return function($delegate){
            var now = DateTime();;
            return  {
                log: function(){
                    $delegate.log(arguments);
                },
                info: function(){
                    $delegate.info(arguments);
                },
                error: function(){
                    $delegate.error(arguments);
                },
                warn:function(){
                    $delegate.warn(arguments);
                    console.log("SHADOW WARN: " + now, arguments);
                },
                debug:function(){
                    $delegate.debug(arguments);
                    console.log("SHADOW DEBUG: " + now, arguments);
                }
            };
        };
    })


//////////////////////////////////////////////////////////////////////////////////////
////////////////////// STACKTRACE WAY//////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

    /*
    Inner factory to be injected to ErrorLogFactory.
    It allows using the print method to print the error stacktrace.
     */
    .factory('StackTraceFactory',['$log',
        function ($log) {
            var factory = {};

            // "printStackTrace" is a global object.
            factory.print = printStackTrace;


            return factory;
    }])

    /*
    The ErrorLogFactory handles the log content (exception  + cause) and
    send it to the server
     */
    .factory('ErrorLogFactory',['$log', '$window', 'StackTraceFactory', 'RESTFactory',
        function( $log, $window, StackTraceFactory, RESTFactory) {

            // Log the given error to the remote server.
            function log( exception, cause ) {

                /*
                  Pass off the error to the default error handler on the AngularJS logger.
                  This will output the error to the console (and let the application keep running
                  normally for the user).
                 */
                $log.error.apply( $log, arguments );

                /*
                 Passing the error to the server log.
                 TODO: In production, it is needed logic to prevent the same client from logging the same error over and over again.
                 */
                try {
                    /*
                    MODIFICATION POINT!!!!!!!!!
                     */
                    var errorMessage = exception.toString();
                    var stackTrace = StackTraceFactory.print({ e: exception });

                    // Log the JavaScript error to the server.
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

                    // ONLY FOR DEVELOPERS - log the log-failure.
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

//////////////////////////////////////////////////////////////////////////////////////
////////////////////// UTILITIES                    //////////////////////////////////

/**
 * DateTime utility class
 *
 */
function DateTime(date, format) {
    var date = date || new Date();
    var format = format || '%M:%d:%h:%m:%s:%z';

    function pad(value)
    {
        return (value.toString().length < 2) ? '0' + value : value;
    }

    return format.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
        switch (fmtCode)
        {
            case 'Y' :  return     date.getFullYear();
            case 'M' :  return pad(date.getMonth() + 1);
            case 'd' :  return pad(date.getDate());
            case 'h' :  return pad(date.getHours());
            case 'm' :  return pad(date.getMinutes());
            case 's' :  return pad(date.getSeconds());
            case 'z':   return pad(date.getMilliseconds());
            default:
                throw new Error('Unsupported format code: ' + fmtCode);
        }
    });
};