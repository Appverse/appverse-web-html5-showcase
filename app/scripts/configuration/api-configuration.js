'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// CONFIGURATION MODULE (AppConfiguration)
////////////////////////////////////////////////////////////////////////////
// It includes constants for all the common API components.
////////////////////////////////////////////////////////////////////////////


angular.module('AppConfiguration')
.constant('PROJECT_DATA', {
    ApplicationName: '',
    Version: '',
    Company: '',
    Year: '',
    Team:'',
    URL: ''
})
.constant('CACHE_CONFIG', {
     ScopeCache_duration: '10000',
     ScopeCache_capacity: '10',
     BrowserStorage_type: '1',
     HttpCache_duration: '100000',
     HttpCache_capacity: '10',
     IndexedDB_objectStore:'structuredCache',
     IndexedDB_keyPath:'messages',
     IndexedDB_mainIndex:'name',
     IndexedDB_mainIndex_isUnique:'false',
     IndexedDB_secondaryIndex:'property',
     IndexedDB_secondaryIndex_isUnique:'false'

})
.constant('SERVERPUSH_CONFIG', {
        /*
         resource
         defaults to socket.io
         Note the subtle difference between the server, this one is missing a /. These 2 should be in sync with the server to prevent mismatches.

         connect timeout
         defaults to 10000 ms
         How long should Socket.IO wait before it aborts the connection attempt with the server to try another fall-back. Please note that some transports require a longer timeout than others. Setting this really low could potentially harm them.

         try multiple transports
         defaults to true
         When Socket.IO reconnects and it keeps failing over and over again, should it try all available transports when it finally gives up.

         reconnect
         defaults to true
         Should Socket.IO automatically reconnect when it detects a dropped connection or timeout.

         reconnection delay
         defaults to 500 ms
         The initial timeout to start a reconnect, this is increased using an exponential back off algorithm each time a new reconnection attempt has been made.

         reconnection limit
         defaults to Infinity
         The maximum reconnection delay in milliseconds, or Infinity.

         max reconnection attempts
         defaults to 10
         How many times should Socket.IO attempt to reconnect with the server after a a dropped connection. After this we will emit the reconnect_failed event.

         sync disconnect on unload
         defaults to false
         Do we need to send a disconnect packet to server when the browser unloads.

         auto connect
         defaults to true
         When you call io.connect() should Socket.IO automatically establish a connection with the server.

         flash policy port
         defaults to 10843
         If you have Flashsocket enabled, this should match the same port as the server.

         force new connection
         defaults to false
         Force multiple io.connect() calls to the same server to use different connections.
         */
     BaseUrl: 'http://server.com',
     ListenedPort: '80',
     Resource:'socket.io',
     ConnectTimeout:'10000',
     TryMultipleTransports: true,
     Reconnect: true
})
.constant('REST_CONFIG', {
   /*
    The base URL for all calls to a given set of REST resources.
    This configuration is related only to calls to the set main url.
    */    
    BaseUrl: '',
    //These are the fields that you want to save from your parent resources if you need to display them.
    ExtraFields: '',
    /*
         Use this property to control whether Restangularized elements to have a parent or not.
         This method accepts 2 parameters:
         Boolean: Specifies if all elements should be parentless or not
         Array: Specifies the routes (types) of all elements that should be parentless. For example ['buildings']
    */
    ParentLess: '',
        /*
         $http from AngularJS can receive a bunch of parameters like cache, transformRequest and so on.
         You can set all of those properties in the object sent on this setter so that they will be used
         in EVERY API call made by Restangular. This is very useful for caching for example.
         All properties that can be set can be checked here:
         http://docs.angularjs.org/api/ng.$http#parameters
         */
    DefaultHttpFields: {'cache': true},
        /*
        HTTP methods will be validated whether they are cached or not.
         */
    NoCacheHttpMethods: {'get': false,'post': true,'put': true,'delete': true,'option': false},
        /*
         This is a hook. After each element has been "restangularized" (Added the new methods from Restangular),
         the corresponding transformer will be called if it fits.
         This should be used to add your own methods / functions to entities of certain types.
         You can add as many element transformers as you want.
         The signature of this method can be one of the following:

         1-Transformer is called with all elements that have been restangularized, no matter if they're collections or not:
         addElementTransformer(route, transformer)
         2-Transformer is called with all elements that have been restangularized and match the specification regarding
         if it's a collection or not (true | false):
         addElementTransformer(route, isCollection, transformer)
         */
    ElementTransformer: '',
        /*
         This is a hook. After each element has been "restangularized" (Added the new methods from Restangular),
         this will be called. It means that if you receive a list of objects in one call, this method will be called
         first for the collection and then for each element of the collection.
         It is recommended the usage of addElementTransformer instead of onElemRestangularized whenever
         possible as the implementation is much cleaner.
         This callback is a function that has 3 parameters:
         @param elem: The element that has just been restangularized. Can be a collection or a single element.
         @param isCollection: Boolean indicating if this is a collection or a single element.
         @param what: The model that is being modified. This is the "path" of this resource. For example buildings
         @param Restangular: The instanced service to use any of its methods
         */
    OnElemRestangularized: '',
        /*
         The responseInterceptor is called after we get each response from the server.
         It's a function that receives this arguments:

         @param data: The data received got from the server
         @param operation: The operation made. It'll be the HTTP method used except for a GET which returns a list of element which will return getList so that you can distinguish them.
         @param what: The model that's being requested. It can be for example: accounts, buildings, etc.
         @param url: The relative URL being requested. For example: /api/v1/accounts/123
         @param response: Full server response including headers
         @param deferred: The deferred promise for the request.

         Some of the use cases of the responseInterceptor are handling wrapped responses and enhancing
         response elements with more methods among others.
         The responseInterceptor must return the restangularized data element.
         */
    ResponseInterceptor: '',
        /*
         The requestInterceptor is called before sending any data to the server.
         It's a function that must return the element to be requested.

         @param element: The element to send to the server.
         @param operation: The operation made. It'll be the HTTP method used except for a GET which returns a list
         of element which will return getList so that you can distinguish them.
         @param what: The model that's being requested. It can be for example: accounts, buildings, etc.
         @param url: The relative URL being requested. For example: /api/v1/accounts/123
         */
    RequestInterceptor: '',
        /*
         The fullRequestInterceptor is similar to the requestInterceptor but more powerful.
         It lets you change the element, the request parameters and the headers as well.
         It's a function that receives the same as the requestInterceptor plus the headers and the query parameters (in that order).
         It must return an object with the following properties:
         headers: The headers to send
         params: The request parameters to send
         element: The element to send
         httpConfig: The httpConfig to call with
         */
    FullRequestInterceptor: '',
        /*
         The errorInterceptor is called whenever there's an error.
         It's a function that receives the response as a parameter.
         The errorInterceptor function, whenever it returns false, prevents the promise
         linked to a Restangular request to be executed.
         All other return values (besides false) are ignored and the promise follows the usual path,
         eventually reaching the success or error hooks.
         The feature to prevent the promise to complete is useful whenever you need to intercept
         each Restangular error response for every request in your AngularJS application in a single place,
         increasing debugging capabilities and hooking security features in a single place.
         */
    ErrorInterceptor: '',
        /*
         Restangular required 3 fields for every "Restangularized" element. These are:

         id: Id of the element. Default: id
         route: Name of the route of this element. Default: route
         parentResource: The reference to the parent resource. Default: parentResource
         restangularCollection: A boolean indicating if this is a collection or an element. Default: restangularCollection
         cannonicalId: If available, the path to the cannonical ID to use. Usefull for PK changes
         etag: Where to save the ETag received from the server. Defaults to restangularEtag
         selfLink: The path to the property that has the URL to this item. If your REST API doesn't return a
         URL to an item, you can just leave it blank. Defaults to href
         Also all of Restangular methods and functions are configurable through restangularFields property.
         All of these fields except for id and selfLink are handled by Restangular, so most of the time you won't change them.
         You can configure the name of the property that will be binded to all of this fields by setting restangularFields property.
         */
    RestangularFields: '',
        /*
         You can now Override HTTP Methods. You can set here the array of methods to override.
         All those methods will be sent as POST and Restangular will add an X-HTTP-Method-Override
         header with the real HTTP method we wanted to do.
         */
    MethodOverriders: '',
        /*
         You can set default Query parameters to be sent with every request and every method.
         Additionally, if you want to configure request params per method, you can use
         requestParams configuration similar to $http.
         For example RestangularProvider.requestParams.get = {single: true}.
         Supported method to configure are: remove, get, post, put, common (all).
         */
    DefaultRequestParams: '',
        /*
         You can set fullResponse to true to get the whole response every time you do any request.
         The full response has the restangularized data in the data field,
         and also has the headers and config sent. By default, it's set to false.
         */
    FullResponse: false,
        /*
         You can set default Headers to be sent with every request.
         */
    DefaultHeaders: '',
        /*
         If all of your requests require to send some suffix to work, you can set it here.
         For example, if you need to send the format like /users/123.json you can add that .json
         to the suffix using the setRequestSuffix method
         */
    RequestSuffix: '',
        /*
         You can set this to either true or false.
         If set to true, then the cannonical ID from the element will be used for URL creation
         (in DELETE, PUT, POST, etc.).
         What this means is that if you change the ID of the element and then you do a put,
         if you set this to true, it'll use the "old" ID which was received from the server.
         If set to false, it'll use the new ID assigned to the element.
         */
    UseCannonicalId: false,
        /*
         You can set here if you want to URL Encode IDs or not.
         */
    EncodeIds: true
})
.constant('I18N_SETTINGS', {
    PreferredLang: 'en'
})
.constant('I18N_MESSAGES_EN', {
     HEADLINE: 'International Section',
     INTRO_TEXT: 'AppVerse HTML5 supports multi-language.'
})
.constant('I18N_MESSAGES_ES', {
     HEADLINE: 'Seccion Internacional',
     INTRO_TEXT: 'AppVerse HTML5 soporta multilenguaje.'
});




        