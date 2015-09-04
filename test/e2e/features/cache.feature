Feature: CACHE

Narrative:
In order to compare testing frameworks for HTML5 apps
As a user
I want to be able to execute end to end tests for the AppVerse Showcase

Background:
Given I go to Content/Cache
    And data is shown in the table


Scenario Outline: Create a new item at Content/Cache
Meta:
@scIndexedDBCreate

When I enter title: <title>, item description: <description>
    And click on the Create/Update Button
Then total items is initial number of items plus one new item

When I click on the Clear Form for a new Note button
    And I enter title: <title>, item description: <description>
    And click on the Create/Update Button
Then total items is initial number of items plus two new items

Examples:

| title        | description |
| IndexedDB 1  | content 1   |


Scenario Outline: Edit a current item at Content/Cache
Meta:
@scIndexedDBEdit

When I click the first row in the table
    And I enter title: <title>, item description: <description>
    And click on the Create/Update Button
Then the first row item title is <title> and item description is <description>
    And total items is initial number of items plus the new created item

Examples:

| title           | description   |
| new IndexedDB 1 | new content 1 |


Scenario Outline: Delete a current item at Content/Cache
Meta:
@scIndexedDBDelete

When I click the delete button in the first row in the table
Then the first row item title should not be <title> and item description should not be <description>
    And total items is initial number

Examples:

| title           | description   |
| new IndexedDB 1 | new content 1 |
