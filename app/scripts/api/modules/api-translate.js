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
    .config(['$translateProvider', 'I18N_SETTINGS', 'I18N_MESSAGES_EN', 'I18N_MESSAGES_ES',
        function($translateProvider, I18N_SETTINGS, I18N_MESSAGES_EN, I18N_MESSAGES_ES) {
        // Our translations will go in here
        $translateProvider.translations('en_US', {
            HEADLINE: I18N_MESSAGES_EN.HEADLINE,
            INTRO_TEXT: I18N_MESSAGES_EN.INTRO_TEXT
        });
        $translateProvider.translations('es_ES', {
            HEADLINE: I18N_MESSAGES_ES.HEADLINE,
            INTRO_TEXT: I18N_MESSAGES_ES.INTRO_TEXT
        });

        $translateProvider.preferredLanguage(I18N_SETTINGS.PreferredLang);
    }]);