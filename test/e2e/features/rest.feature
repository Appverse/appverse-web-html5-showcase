Feature: REST
    Narrative:
    In order to compare testing frameworks for HTML5 apps
    As a user
    I want to be able to execute end to end tests for the AppVerse Showcase

    Scenario Outline: Filter the table at Content/RestEntity
        Meta: @scRestEntityFilter
        Given I go to Content/RestEntity
        And data is shown in the table
        When I set a filter text: <name>
        Then one row is shows in the table with name: <name>

        Examples:
            | name |
            | Ethel |
            | Neal |
            | Trevino |

    Scenario Outline: Modal with missing fields
        Meta: @scRestEntityModalMissing
        Given I go to Content/RestEntity
        And data is shown in the table
        When I click on AddUser button
        And enter name: <name>
        Then the add button is disabled

        Examples:
            | name |
            | Ethel |
            | Neal |
            | Trevino |

    Scenario Outline: Modal Add User
        Meta:  @scRestEntityModalAddUser
        Given I go to Content/RestEntity
        And data is shown in the table
        When I click on AddUser button
        And enter name: <name>, gender: <gender>, company: <company>, age: <age>
        And click Add Button
        Then total items is 24

        Examples:
            | name | gender | company | age |
            | Ethel Price | female | Enersol | 25 |
            | Claudine Neal | female | Sealoud | 19 |
            | Trevino Moreno | male | Conjurica | 31 |

    Scenario Outline: Delete user confirm
        Meta:  @scRestEntityDeleteConfirm
        Given I go to Content/RestEntity
        And data is shown in the table
        When I click at bin button for name: <name>
        And click OK on confirmation window
        Then an alert is shown indicating failed operation
        And total items is 24

        Examples:
            | name |
            | Ethel Price |
            | Claudine Neal |
            | Trevino Moreno |

    Scenario Outline: Delete user cancel
        Meta:  @scRestEntityDeleteCancel
        Given I go to Content/RestEntity
        And data is shown in the table
        When I click at bin button for name: <name>
        And click Cancel on confirmation window
        Then total items is 24

        Examples:
            | name |
            | Ethel Price |
            | Claudine Neal |
            | Trevino Moreno |

    Scenario: Resize screen
        Meta:  @scRestEntityResizeScreen
        Given I go to Content/RestEntity
        And data is shown in the table
        And I resize window width to 1400
        And Explanation frame appears next to the table float left and width 50
        When I resize window width to 700
        Then Explanation frame appears below the table

    Scenario Outline: Change tab
        Meta:  @scRestEntityChangeTab
        Given I go to Content/RestEntity
        And data is shown in the table
        When I click at <tabname> tab
        Then tab content changed starting by: <content>

        Examples:
            | tabname | content |
            | user-modal.html | <div class="modal-header"> |
            #     | users-controllers.js | angular.module('App.Controllers') |
            | users.json | [    {        "id": 1, |