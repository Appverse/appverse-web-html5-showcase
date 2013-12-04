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

angular.module('AppTranslate', ['pascalprecht.translate', 'AppConfiguration', 'tmh.dynamicLocale'])
    .config(['$translateProvider', 'I18N_CONFIG', 'tmhDynamicLocaleProvider',
        function($translateProvider, I18N_CONFIG, tmhDynamicLocaleProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage(I18N_CONFIG.PreferredLocale);

        tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular/angular-locale_{{locale}}.js');
    }]);
