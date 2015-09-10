  Feature: TRANSLATE

  Narrative:
  In order to compare testing frameworks for HTML5 apps
  As a user
  I want to be able to execute end to end tests for the AppVerse Showcase

  Background:
  Given I go to Content/Translation

Scenario Outline: Change current locale at Content/Translation
  Meta:
  @scTranslationLocale

When I click on the <locale> button
Then the currency should be translated to <currency>
Then the number should be translated to <number>
Then the welcome1 should be translated to <welcome1>
Then the welcome2 should be translated to <welcome2>
Then the welcome3 should be translated to <welcome3>

  Examples:

| locale | currency      | number        | welcome1       | welcome2             | welcome3                                   |
| es-ES  | 100,00&nbsp;€ | 1.200.300,457 | Bienvenido! | Bienvenido Alex ! | Bienvenido Alicia, tienes 25 año(s) !   |
| en-US  | $100.00       | 1,200,300.457 | Welcome!    | Welcome Alex !    | Welcome Alicia, you are 25 year(s) old! |
| ja-JP  | ¥100.00       | 1,200,300.457 | Welcome!    | Welcome Alex !    | Welcome Alicia, you are 25 year(s) old! |
| ar-EG  | £&nbsp;100٫00 | 1200300٫457   | Welcome!    | Welcome Alex !    | Welcome Alicia, you are 25 year(s) old! |
