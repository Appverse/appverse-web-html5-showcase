'use strict';

/**
 * @ngdoc module
 * @name AppConfiguration
 * @requires AppDetection
 * @description
 * It includes constants for all the common API components.
 */
angular.module('AppConfiguration', ['AppDetection'])

.run(['$log',
        function ($log) {

        $log.info('AppConfiguration run');
    }]);

angular.module('AppConfigDefault', [])

/*
PROJECT CONFIGURATION
This constants can be used to set basic information related to the application.
All data are auto-explained because their names ;)
 */
.constant('PROJECT_DATA', {
    ApplicationName: 'Appverse Web HTML5 Incubator Demo',
    Version: '0.1',
    Company: 'GFT',
    Year: '2013',
    Team: 'GFT Appverse Web',
    URL: '',
    LoginViewPath: '/login'
})

/*
LOGGING MODULE CONFIGURATION
This section contains basic configuration for the logging module
in the common API.
These params do not affect normal usage of $log service.
*/
.constant('LOGGING_CONFIG', {
    /*
    This param enables (if true) sending log messages to server.
    The server side REST service must record messages from client in order to be analyzed.
    ALL messages are sent. It is not yet possible select which type of log messages are sent.
     */
    ServerEnabled: false,
    LogServerEndpoint: 'http://localhost:9000/log',
    /*
    This preffix will be included at the beginning of each message.
     */
    CustomLogPreffix: 'APPLOG',
    /*
    Enabled levels will be written in the custom format.
    This param does not affect to $log service.
     */
    EnabledLogLevel: true,
    EnabledErrorLevel: true,
    EnabledDebugLevel: true,
    EnabledWarnLevel: true,
    EnabledInfoLevel: true,
    /*
    Format of the datetime information.
     */
    LogDateTimeFormat: '%Y-%M-%d %h:%m:%s:%z',
    /*
    Fields that will be included in the log message if containing information.
     */
    LogTextFormat: ''
})

/*
CACHE MODULE CONFIGURATION
This section contains basic configuration for the several types of cache handled by the cache module
in the common API.
*/
.constant('CACHE_CONFIG', {
    /////////////////////////////
    //SCOPE CACHE
    /////////////////////////////
    ScopeCache_Enabled: true,
    DefaultScopeCacheName: 'commonApiScopeDataCache',
    /*
     Max duration in milliseconds of the scope cache
      */
    ScopeCache_duration: 10000,
    /*
     This param turns the scope cache into a LRU one.
     The cache’s capacity is used together to track available memory.
      */
    ScopeCache_capacity: 10,

    /////////////////////////////
    //BROWSER STORAGE TYPE
    //This sets the preferred browser storage in the app.
    //Most of times it is convenient follow a policy for browser storage, using only one of the two types.
    //If you prefer flexibility (the developer makes a choice for each case) do not use the provided API.
    /////////////////////////////
    BrowserStorageCache_Enabled: true,
    /*
     1 = $localStorage
     2 = $sessionStorage
      */
    BrowserStorage_type: '2',
    DefaultBrowserCacheName: 'commonApiBrowserCache',
    // Items added to this cache expire after 15 minutes.
    MaxAge: 900000,
    // This cache will clear itself every hour.
    CacheFlushInterval: 3600000,
    // Items will be deleted from this cache right when they expire.
    DeleteOnExpire: 'aggressive',
    //Constant for the literal
    SessionBrowserStorage: 'sessionStorage',
    //Constant for the literal
    LocalBrowserStorage: 'localStorage',
    //Constant for the literal
    NoBrowserStorage: 'none',
    /*
     * Specify whether to verify integrity of data saved in localStorage on every operation.
     * If true, angular-cache will perform a full sync with localStorage on every operation.
     * Increases reliability of data synchronization, but may incur a performance penalty.
     * Has no effect if storageMode is set to "none".
     */
    VerifyIntegrity: false,
    /////////////////////////////
    //$http SERVICE CACHE
    /////////////////////////////
    HttpCache_Enabled: true,
    /*
     Max duration in milliseconds of the http service cache.
     */
    HttpCache_duration: 20000,
    /*
     This param turns the http cache into a LRU one.
     The cache’s capacity is used together to track available memory.
     */
    HttpCache_capacity: 10,
    /////////////////////////////
    //BROWSER'S INDEXED DB CACHE
    /////////////////////////////
    IndexedDBCache_Enabled: false,
    /*
     Name of the default object store
      */
    IndexedDB_name: 'DefaultIDBCache',
    /*
     The version for the version (mandatory)
      */
    IndexedDB_version: 1,
    /*
     * The options for the db.
     * The default structure is defined as id/name pairs.
     * It is possible to add more indexes:
     * indexes : [{ name : 'indexName', unique : 'true/false' },{},...]
     */
    IndexedDB_options: [
        {
            storeName: 'structure-of-items',
            keyPath: 'id',
            indexes: [
                {
                    name: 'name',
                    unique: false
                }
            ]
        }
    ]

})

/*
SERVER PUSH MODULE CONFIGURATION
This section contains the configuration for the server push module.
It si related to socket.io configuration params.
Read Configuration section in socket.io documentation for further details.
https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
*/
.constant('SERVERPUSH_CONFIG', {
    /*
     URL of the listened server
      */
    BaseUrl: 'http://localhost:3000',
    /*
     Port to be listened at the base url.
      */
    ListenedPort: '3000',
    /*
      resource
      defaults to socket.io
      Note the subtle difference between the server, this one is missing a /.
      These 2 should be in sync with the server to prevent mismatches.
      */
    Resource: 'socket.io',
    /*
      connect timeout
      defaults to 10000 ms
      How long should Socket.IO wait before it aborts the connection attempt with the server to try another fall-back.
      Please note that some transports require a longer timeout than others.
      Setting this really low could potentially harm them.
      */
    ConnectTimeout: '10000',
    /*
      try multiple transports
      defaults to true
      When Socket.IO reconnects and it keeps failing over and over again, should it try all available transports when it finally gives up.
      */
    TryMultipleTransports: true,
    /*
      reconnect
      defaults to true
      Should Socket.IO automatically reconnect when it detects a dropped connection or timeout.
      */
    Reconnect: true,
    /*
      reconnection delay
      defaults to 500 ms
      The initial timeout to start a reconnect, this is increased using an exponential back off algorithm each time a new reconnection attempt has been made.
      */
    ReconnectionDelay: 1000,
    /*
      reconnection limit
      defaults to Infinity
      The maximum reconnection delay in milliseconds, or Infinity.
      */
    ReconnectionLimit: 'Infinity',
    /*
      max reconnection attempts
      defaults to 10
      How many times should Socket.IO attempt to reconnect with the server after a a dropped connection. After this we will emit the reconnect_failed event.
      */
    MaxReconnectionAttempts: 5,
    /*
      sync disconnect on unload
      defaults to false
      Do we need to send a disconnect packet to server when the browser unloads.
      */
    SyncDisconnectOnUnload: false,
    /*
      auto connect
      defaults to true
      When code calls io.connect() should Socket.IO automatically establish a connection with the server.
      */
    AutoConnect: true,
    /*
      flash policy port
      defaults to 10843
      If the server has Flashsocket enabled, this should match the same port as the server.
      */
    FlashPolicyPort: '',
    /*
      force new connection
      defaults to false
      Force multiple io.connect() calls to the same server to use different connections.
      */
    ForceNewConnection: false
})

/*
REST MODULE CONFIGURATION
This section contains the ccnfiguration for the REST module.
This module (and/or) its clones is based on Restangular (https://github.com/mgonto/restangular).
So, all configuration params are based on its configuration (https://github.com/mgonto/restangular#configuring-restangular).
Future updates of Restangular imply review of this section in order to keep consistency between config and the module.
 */
.constant('REST_CONFIG', {
    /*
    The base URL for all calls to your API.
    For example if your URL for fetching accounts is http://example.com/api/v1/accounts, then your baseUrl is /api/v1.
    The default baseUrl is an empty string which resolves to the same url that AngularJS is running, so you can also set an absolute url like http://api.example.com/api/v1 if you need do set another domain.
    */
    BaseUrl: '/api/v1',

    /*
    These are the fields that you want to save from your parent resources if you need to display them.
    By default this is an Empty Array which will suit most cases.
    */
    ExtraFields: [],

    /*
    Use this property to control whether Restangularized elements to have a parent or not.
    This method accepts 2 parameters:
    Boolean: Specifies if all elements should be parentless or not
    Array: Specifies the routes (types) of all elements that should be parentless. For example ['buildings']
    */
    ParentLess: false,

    /*
    HTTP methods will be validated whether they are cached or not.
    */
    NoCacheHttpMethods: {
        'get': false,
        'post': true,
        'put': false,
        'delete': true,
        'option': false
    },

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
    ElementTransformer: [],

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
    OnElemRestangularized: function (elem) {
        return elem;
    },

    /*
    The requestInterceptor is called before sending any data to the server.
    It's a function that must return the element to be requested.

    @param element: The element to send to the server.
    @param operation: The operation made. It'll be the HTTP method used except for a GET which returns a list
    of element which will return getList so that you can distinguish them.
    @param what: The model that's being requested. It can be for example: accounts, buildings, etc.
    @param url: The relative URL being requested. For example: /api/v1/accounts/123
    */
    RequestInterceptor: null,

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
    FullRequestInterceptor: null,

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
    ErrorInterceptor: function (response) {
        console.log("ErrorInterceptor, server response:", response);
    },

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
    RestangularFields: {
        id: 'id',
        route: 'route'
    },

    /*
    You can now Override HTTP Methods. You can set here the array of methods to override.
    All those methods will be sent as POST and Restangular will add an X-HTTP-Method-Override
    header with the real HTTP method we wanted to do.
    */
    MethodOverriders: [],

    /*
    You can set default Query parameters to be sent with every request and every method.
    Additionally, if you want to configure request params per method, you can use
    requestParams configuration similar to $http.
    For example RestangularProvider.requestParams.get = {single: true}.
    Supported method to configure are: remove, get, post, put, common (all).
    */
    DefaultRequestParams: {},

    /*
    You can set fullResponse to true to get the whole response every time you do any request.
    The full response has the restangularized data in the data field,
    and also has the headers and config sent. By default, it's set to false.
    */
    FullResponse: false,

    /*
    You can set default Headers to be sent with every request.
    Example:
    DefaultHeaders: {'Content-Type': 'application/json'}
    */
    DefaultHeaders: {},

    /*
    If all of your requests require to send some suffix to work, you can set it here.
    For example, if you need to send the format like /users/123.json you can add that .json
    to the suffix using the setRequestSuffix method
    */
    RequestSuffix: '.json',

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

.constant('AD_CONFIG', {
    ConsumerKey: '',
    ConsumerSecret: ''
})

.constant('I18N_CONFIG', {
    PreferredLocale: 'en-US',
    DetectLocale: true
})

/*
 * SECURITY SECTION
 * Includes default information about authentication and authorization configuration based on OAUTH 2.0.
 */
.constant('SECURITY_GENERAL', {
    securityEnabled: false
})

.constant('SECURITY_OAUTH', {
    oauth2_endpoint: 'lelylam',
    clientID: '',
    profile: 'http://api.lelylan.com/me',
    scope: 'resources',
    scopeURL: 'http://people.lelylan.com',
    scope_authorizePath: '/oauth/authorize',
    scope_tokenPath: '/oauth/token',
    scope_flow: 'implicit',
    scope_view: 'standard',
    scope_storage: 'none',
    scope_template: 'views/demo/security/oauth_default.html',
    redirectURL: 'http://localhost:9000',
    storage: 'cookies'
})

/*
 * GOOGLE AUTHENTICATION
 */
.constant('GOOGLE_AUTH', {
    clientID: '75169325484-8cn28d7o3dre61052o8jajfsjlnrh53i.apps.googleusercontent.com',
    scopeURL: 'https://www.googleapis.com/auth/plus.login',
    requestvisibleactionsURL: 'http://schemas.google.com/AddActivity',
    theme: 'dark',
    cookiepolicy: 'single_host_origin',
    revocationURL: 'https://accounts.google.com/o/oauth2/revoke?token=',
    /*
     * Policy about token renewal:
     * revocation: if the token is invalid the user is fordec to logout and warned.
     * manual_renovation: the user is warned about the token validity. Renewal is proposed.
     * automatic_renovation: the token is automatically renewed.
     */
    revocation: 'revocation',
    manual_renovation: 'manual_renovation',
    automatic_renovation: 'automatic_renovation',
    tokenRenewalPolicy: this.automatic_renovation
})

/*
 *
 */
.constant('AUTHORIZATION_DATA', {
    roles: ['user', 'admin', 'editor'],
    adminRoles: ['admin', 'editor'],
    users: ['Jesus de Diego'],
    userRoleMatrix: [
        {
            'user': 'Jesus de Diego',
            'roles': ['user', 'admin']
        },
        {
            'user': 'Antoine Charnoz',
            'roles': ['user', 'admin']
        }
    ],
    routesThatDontRequireAuth: ['/home'],
    routesThatRequireAdmin: ['/about']
})


/////////////////////////////
//PERFORMANCE
//Includes default information about the different facets for a better performance in the app.
//There are three main sections: webworkers management, shadow dom objetc and High performance DOM directive.
/////////////////////////////
.constant('PERFORMANCE_CONFIG', {
/*
 * WEBWORKERS SECTION
 * To test multiple parallelized threads with web workers a thread pool or task queue is defined.
 * The goal is focused on using enough threads to improve the execution but not too much or the browser system can turn
 * into unstable.
 * You can configure the maximum number of concurrent web workers when this pool is instantiated,
 * and any 'task' you submit will be executed using one of the available threads from the pool.
 * Note that the app is not really pooling threads, but just using this pool to control the number of concurrently
 * executing web workers due to the high cost for start them.
 */
        /*
        Maximum number of simultaneous executing threads used by workers
         */
        Webworker_pooled_threads: 4,
        /*
        If true, only workers in the web worker_authorized_workers property might be executed.
        Other invoked workers will not result in a worker call.
         */
        Webworker_authorized_workers_only: true,
        /*
        Folder for workers' files
         */
        Webworker_directory: "resources/webworkers/",
        /*
        List of authorized workers with its ID.
        The ID is used to be passed in the directive's attribute.
         */
        Webworker_authorized_workers: [
            {
                'id': 'w1',
                'type': 'shared',
                'file': 'a.js'
            },
            {
                'user': 'w2',
                'type': 'shared',
                'file': 'b.js'
            },
            {
                'user': 'wpi',
                'type': 'dedicated',
                'file': 'pi.js'
            }
        ],
        Webworker_dedicated_literal: "dedicated",
        Webworker_shared_literal: "shared"


/*
 * SHADOWDOM SECTION
 *
 */
    })
