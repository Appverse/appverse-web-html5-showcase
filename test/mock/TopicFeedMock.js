'use strict';

angular.module('mockedFeed', [])
  .value('topicsMock', {
    query: {
      count: 2,
      created: '2013-05-16T15:01:31Z',
      lang: 'en-US',
      results: {
        "topics":[
            {
              "id": 1,
              "name": "Security",
              "items": [
                {
                  "id": "a",
                  "type": "Priority",
                  "value": "high"
                },
                {
                  "id": "b",
                  "type": "Assigned PSU Task",
                  "value": "TMENU-17"
                }
              ]
            },
            {
              "id": 2,
              "name": "Styling",
              "items": [
                {
                  "id": "a",
                  "type": "Priority",
                  "value": "high"
                },
                {
                  "id": "b",
                  "type": "Assigned PSU Task",
                  "value": "TMENU-11"
                }
              ]
            }
          ]
      }
    }
  });

