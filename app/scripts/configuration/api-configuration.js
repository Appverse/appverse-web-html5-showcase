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
.constant('CACHE_SERVICE', {
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
.constant('REST_CONFIG', {
   /*
    The base URL for all calls to a given set of REST resources.
    This configuration is related only to calls to the set main url.
    */    
    BaseUrl: '',
    ExtraFields: '',
    DefaultHttpFields: {'cache': true},
    NoCacheHttpMethods: {'get': false,'post': true,'put': true,'delete': true,'option': false},
    ElementTransformer: '',
    ResponseInterceptor: '',
    FullRequestInterceptor: '',
    ErrorInterceptor: '',
    RestangularFields: '',
    MethodOverriders: '',
    DefaultRequestParams: '',
    FullResponse: '',
    DefaultHeaders: '',
    RequestSuffix: '',
    UseCannonicalId: '',
    EncodeIds: ''
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




        