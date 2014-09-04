# appverse-web-html5

Appverse HTML5/JS development framework.

###Read More
[Project Site](http://appverse.org/projects/appverse-web/)

###Download
[GitHub page](https://github.com/Appverse/appverse-web-html5)
  or
`bower install appverse-web-html5`


##Running (For using Appverse in your Angular app)

####Before you start, tools you will need
* Download and install [git](http://git-scm.com/downloads)
* Download and install [nodeJS](http://nodejs.org/download/)
* Install bower `npm install -g bower`

####Inside of your app:
* Run `bower install appverse-web-html5`
* Add the following to your index.html
```html
  <!-- ########## API modules ########## -->

    <!-- Cache module -->
    <script src="bower_components/angular-cache/dist/angular-cache.min.js"></script>
    <script src="bower_components/appverse-web-html5/api/modules/api-cache.js"></script>

    <script src="bower_components/appverse-web-html5/api/modules/api-configuration.js"></script>
    <script src="bower_components/appverse-web-html5/api/modules/api-detection.js"></script>
    <script src="bower_components/appverse-web-html5/api/modules/api-logging.js"></script>
    <script src="bower_components/appverse-web-html5/api/modules/api-main.js"></script>

    <!-- REST module -->
    <script src="bower_components/lodash/dist/lodash.underscore.min.js"></script>
    <script src="bower_components/restangular/dist/restangular.min.js"></script>
    <script src="bower_components/appverse-web-html5/api/modules/api-rest.js"></script>

    <!-- Security module -->
    <script src="bower_components/appverse-web-html5/api/modules/api-security.js"></script>

    <!-- Server Push module -->
    <script src="bower_components/appverse-web-html5/api/modules/api-serverpush.js"></script>

    <!-- Translate module -->
    <script src="bower_components/appverse-web-html5/api/modules/api-translate.js"></script>
    <script src="bower_components/angular-translate/angular-translate.min.js"></script>
    <script src="bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js"></script>
    <script src="bower_components/angular-dynamic-locale/src/tmhDinamicLocale.js"></script>

    <script src="bower_components/appverse-web-html5/api/modules/api-utils.js"></script>

    <!-- Directives should be included after the modules -->
    <script src="bower_components/appverse-web-html5/api/directives/cache-directives.js"></script>
    <script src="bower_components/appverse-web-html5/api/directives/rest-directives.js"></script>
    <script src="bower_components/appverse-web-html5/api/modules/api-performance.js"></script>
    <!-- endbuild -->
```
* Add the `appverse-web-html5` module to your Angular module list (e.g. in a main app.js file: `angular.module('yourMainModule',['COMMONAPI'])`)



