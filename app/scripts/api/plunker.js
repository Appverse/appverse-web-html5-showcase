angular.module('plunker', [])

  .factory('plunkGenerator', function ($document) {

    return function (ngVersion, bsVersion, version, module, content) {

      var form = angular.element('<form style="display: none;" method="post" action="http://plnkr.co/edit/?p=preview" target="_blank"></form>');
      var addField = function (name, value) {
        var input = angular.element('<input type="hidden" name="' + name + '">');
        input.attr('value', value);
        form.append(input);
      };

      var indexContent = function (content, version) {
        return '<!doctype html>\n' +
          '<html ng-app="appverseClientIncubatorApp">\n' +
          '  <head>\n' +
          '    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/'+ngVersion+'/angular.js"></script>\n' +
          '    <script src="script.js"></script>\n' +
          '  </head>\n' +
          '  <body>\n\n' +
          content + '\n' +
          '  </body>\n' +
          '</html>\n';
      };

      var scriptContent = function(content) {
        //return "angular.module('plunker', ['ui.bootstrap']);" + "\n" + content;
        return "angular.module('appverseClientIncubatorApp');" + "\n" + content;
      };

      addField('description', 'Code for the specific view.');
      addField('files[view.html]', indexContent(content.markup, version));
      addField('files[script.js]', scriptContent(content.javascript));

      $document.find('body').append(form);
      form[0].submit();
      form.remove();
    };
  })

  .controller('PlunkerCtrl', function ($scope, plunkGenerator) {

    $scope.content = {};

    $scope.edit = function (ngVersion, bsVersion, version, module) {
      plunkGenerator(ngVersion, bsVersion, version, module, $scope.content);
    };
  })

  .directive('plunkerContent', function () {
    return {
      link:function (scope, element, attrs) {
        scope.content[attrs.plunkerContent] = element.text().trim();
      }
    }
  });
