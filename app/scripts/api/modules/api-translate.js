////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// INTERNATIONALIZATION MODULE (AppTranslate)
////////////////////////////////////////////////////////////////////////////
// The Internationalization module handles languages in application.
// It should be directly configurable by developers.
// WARNING
// Items in each translations object must match to items defined
// in the Configuration module.
////////////////////////////////////////////////////////////////////////////

angular.module('AppTranslate', ['pascalprecht.translate', 'AppConfiguration'])
    .config(['$translateProvider', 'I18N_CONFIG',
        function($translateProvider, I18N_CONFIG) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage(I18N_CONFIG.PreferredLocale);
    }]);
