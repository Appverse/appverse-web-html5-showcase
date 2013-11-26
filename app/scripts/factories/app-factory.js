angular.module('appverseClientIncubatorApp')

    /*
     * Factory Name: 'topics'
     * This factory contains is RESTful for retrieving topics 
     * from data (in this case'topics.json').
     */
  .factory('topics', ['$http', function ($http, utils) {
    var path = 'views/topics/topics.json';
    var topics = $http.get(path).then(function (resp) {
      return resp.data.topics;
    });



    var factory = {};
    factory.all = function () {
      return topics;
    };
    factory.get = function (id) {
      return topics.then(function(){
        return utils.findById(topics, id);
      })
    };
    return factory;
  }])
   
   /*
    * Factory Name: 'utils'
    * Contains methods for data finding (demo).
    * 
    * findById: Util for finding an object by its 'id' property among an array
    * newRandomKey: Util for returning a randomKey from a collection that also isn't the current key
    */
  .factory('utils', function () {

    return {

      // 
      findById: function findById(a, id) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].id == id) return a[i];
        }
        return null;
      },

      newRandomKey: function newRandomKey(coll, key, currentKey){
        var randKey;
        do {
          randKey = coll[Math.floor(coll.length * Math.random())][key];
        } while (randKey == currentKey);
        return randKey;
      }

    };

  });
