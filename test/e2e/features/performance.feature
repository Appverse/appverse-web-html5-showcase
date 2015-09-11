Feature: Performance
    Narrative:
    In order to compare testing frameworks for HTML5 apps
    As a user
    I want to be able to execute end to end tests for the AppVerse Showcase

    Scenario: Performance WebWorkers
        Meta: @scPerfWebWorkers
        Given I go to Performance/WebWorkers
        When shows blue result
        And I click on Run button
        Then shows result in green after execution