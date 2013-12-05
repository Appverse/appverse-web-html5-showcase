//////////////////////////////////////////////////
// The main module configuration section shows  //
// how to define when (redirects) and otherwise //
// (invalid urls) to arrangesite navigation     //
// using ui-router.                             //
//////////////////////////////////////////////////

'use strict';

angular.module('appverseClientIncubatorApp')
    .config(
    ['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {

                ///////////////////////////////
                // 1-Redirects and Otherwise //
                ///////////////////////////////

                // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
                $urlRouterProvider

                // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
                // Here we are just setting up some convenience urls.
                .when('/c?id', '/topics/:id')
                    .when('/user/:id', '/topics/:id')


                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
                .otherwise('/');


                //////////////////////////
                // 2-State Configurations
                // Several states hav been configured:
                // home
                // topics
                // topics.list
                // topics.detail
                // topics.detail.item
                // ui.list
                // serverpush
                // about
                //
                //////////////////////////

                // We must configure states using $stateProvider.
                $stateProvider

                //////////
                // Home //
                //////////

                .state("home", {

                    // Use a url of "/" to set a states as the "index".
                    url: "/",
                    templateUrl: 'views/main.html'

                })

                ///////////////////
                // State: Topics //
                ///////////////////

                .state('topics', {

                    // With abstract set to true, that means this state can not be explicitly activated.
                    // It can only be implicitly activated by activating one of it's children.
                    abstract: true,

                    // This abstract state will prepend '/topics' onto the urls of all its children.
                    url: '/topics',

                    // Example of loading a template from a file. This is also a top level state,
                    // so this template file will be loaded and then inserted into the ui-view
                    // within index.html.
                    templateUrl: 'views/topics/topics.html',

                    // Use `resolve` to resolve any asynchronous controller dependencies
                    // *before* the controller is instantiated. In this case, since topics
                    // returns a promise, the controller will wait until topics.all() is
                    // resolved before instantiation. Non-promise return values are considered
                    // to be resolved immediately.
                    resolve: {
                        topics: ['topics',
                            function (topics) {
                                return topics.all();
                            }]
                    },

                    // You can pair a controller to your template. There *must* be a template to pair with.
                    // controller: ['$scope', '$state', 'topics', 'utils','TopicsController']
                    controller: 'TopicsController'

                })

                //////////////////////////
                // State: Topics > List //
                //////////////////////////

                // Using a '.' within a state name declares a child within a parent.
                // So you have a new state 'list' within the parent 'topics' state.
                .state('topics.list', {

                    // Using an empty url means that this child state will become active
                    // when its parent's url is navigated to. Urls of child states are
                    // automatically appended to the urls of their parent. So this state's
                    // url is '/topics' (because '/topics' + '').
                    url: '',

                    // IMPORTANT: Now we have a state that is not a top level state. Its
                    // template will be inserted into the ui-view within this state's
                    // parent's template; so the ui-view within topics.html. This is the
                    // most important thing to remember about templates.
                    templateUrl: 'views/topics/topics.list.html'
                })

                ///////////////////////
                // Topics > Detail //
                ///////////////////////

                // You can have unlimited children within a state. Here is a second child
                // state within the 'topics' parent state.
                .state('topics.detail', {

                    // Urls can have parameters. They can be specified like :param or {param}.
                    // If {} is used, then you can also specify a regex pattern that the param
                    // must match. The regex is written after a colon (:). Note: Don't use capture
                    // groups in your regex patterns, because the whole regex is wrapped again
                    // behind the scenes. Our pattern below will only match numbers with a length
                    // between 1 and 4.

                    // Since this state is also a child of 'topics' its url is appended as well.
                    // So its url will end up being '/topics/{topicId:[0-9]{1,8}}'. When the
                    // url becomes something like '/topics/42' then this state becomes active
                    // and the $stateParams object becomes { topicId: 42 }.
                    url: '/{topicId:[0-9]{1,4}}',

                    // If there is more than a single ui-view in the parent template, or you would
                    // like to target a ui-view from even higher up the state tree, you can use the
                    // views object to configure multiple views. Each view can get its own template,
                    // controller, and resolve data.

                    // View names can be relative or absolute. Relative view names do not use an '@'
                    // symbol. They always refer to views within this state's parent template.
                    // Absolute view names use a '@' symbol to distinguish the view and the state.
                    // So 'foo@bar' means the ui-view named 'foo' within the 'bar' state's template.
                    views: {

                        // So this one is targeting the unnamed view within the parent state's template.
                        '': {
                            templateUrl: 'views/topics/topics.detail.html',
                            controller: 'TopicDetailsController'
                        },

                        // This one is targeting the ui-view="hint" within the unnamed root, aka index.html.
                        // This shows off how you could populate *any* view within *any* ancestor state.
                        'hint@': {
                            template: 'Hint: Use the ui-view directives to place content anywhere.'
                        },

                        // This one is targeting the ui-view="menu" within the parent state's template.
                        'menuTip': {
                            // templateProvider is the final method for supplying a template.
                            // There is: template, templatUrl, and templateProvider.
                            templateProvider: ['$stateParams',
                                function ($stateParams) {
                                    // This is just to demonstrate that $stateParams injection works for templateProvider.
                                    // $stateParams are the parameters for the new state we're transitioning to, even
                                    // though the global '$stateParams' has not been updated yet.
                                    return '<hr><small class="muted">Topic ID: ' + $stateParams.topicId + '</small>';
                                }]
                        }
                    }
                })

                //////////////////////////////
                // topics > Detail > Item //
                //////////////////////////////

                .state('topics.detail.item', {

                    // So following what we've learned, this state's full url will end up being
                    // '/topics/{topicId}/item/:itemId'. We are using both types of parameters
                    // in the same url, but they behave identically.
                    url: '/item/:itemId',
                    views: {

                        // This is targeting the unnamed ui-view within the parent state 'topic.detail'
                        // We wouldn't have to do it this way if we didn't also want to set the 'hint' view below.
                        // We could instead just set templateUrl and controller outside of the view obj.
                        '': {
                            templateUrl: 'views/topics/topics.detail.item.html',
                            controller: 'TopicDetailsItemController'
                        },

                        // Here we see we are overriding the template that was set by 'topic.detail'
                        'hint@': {
                            template: ' Hint: Use overriding of the ui-view for contextual information.'
                        }
                    }
                })

                /////////////////////////////////////
                // Topics > Detail > Item > Edit //
                /////////////////////////////////////

                // Notice that this state has no 'url'. States do not require a url. You can use them
                // simply to organize your application into "places" where each "place" can configure
                // only what it needs. The only way to get to this state is via $state.go (or transitionTo)
                .state('topics.detail.item.edit', {
                    views: {

                        // This is targeting the unnamed view within the 'topic.detail' state
                        // essentially swapping out the template that 'topic.detail.item' had
                        // had inserted with this state's template.
                        '@topics.detail': {
                            templateUrl: 'views/topics/topics.detail.item.edit.html',
                            controller: 'TopicDetailsItemEditController'
                        }
                    }
                })

                ////////////////////////////////
                // SECTION: UI Bootstrap Demo //
                ////////////////////////////////
                .state('ui', {

                    abstract: false,
                    url: '/ui',
                    templateUrl: 'views/demo/ui-bootstrap/ui-b.html',

                })

                ////////////////////////////////
                // SECTION: Server Push Demo  //
                ////////////////////////////////
                .state('serverpush', {

                    abstract: false,
                    url: '/serverpush',
                    templateUrl: 'views/demo/serverpush/stockmarket.html',
                    // Use `resolve` to resolve any asynchronous controller dependencies
                    // *before* the controller is instantiated. In this case, since topics
                    // returns a promise, the controller will wait until topics.all() is
                    // resolved before instantiation. Non-promise return values are considered
                    // to be resolved immediately.
                    resolve: {
                        trades: ['trades',
                            function (trades) {
                                return trades.all();
                            }]
                    },
                    controller: 'ServerPushController'

                })

                ///////////////////
                // SECTION: CACHE //
                ///////////////////
                .state('cache', {

                    url: '/cache',
                    templateUrl: 'views/cache/cache.html',
                    controller: 'cacheController'
                })

                //////////////////////////
                // SECTION: Translation //
                //////////////////////////
                .state('translation', {

                    url: '/translation',
                    templateUrl: 'views/translation/translation.html',
                    controller: 'translationController'
                })

                ////////////////////
                // SECTION: About //
                ////////////////////

                .state('about', {
                    url: '/about',

                    // Showing off how you could return a promise from templateProvider
                    templateProvider: ['$timeout',
                        function ($timeout) {
                            return $timeout(function () {
                                return '<p class="lead">Appverse Web HTML5 Resources</p><ul>' +
                                    '<li><a href="https://jdediego@appverse.gftlabs.com/git/scm/ahi/html5-incubator.git">Source for the Incubator</a></li>' +
                                    '<li><a href="http://appverse.github.io/appverse-web/">Appverse Web Main Page</a></li>' +
                                    '<li><a href="">Quick Start</a> (Coming soon)</li>' +
                                    '<li><a href="">API Reference</a> (Coming soon)</li>' +
                                    '</ul>';
                            }, 100);
                        }]
                });
            }]);
