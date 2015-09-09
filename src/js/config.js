// config

var app =
        angular.module('app')
            .config(
            [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {

                    // lazy controller, directive and service
                    app.controller = $controllerProvider.register;
                    app.directive  = $compileProvider.directive;
                    app.filter     = $filterProvider.register;
                    app.factory    = $provide.factory;
                    app.service    = $provide.service;
                    app.constant   = $provide.constant;
                    app.value      = $provide.value;
                }
            ])
            .config(['$translateProvider', function($translateProvider){
                // Register a loader for the static files
                // So, the module will search missing translation tables under the specified urls.
                // Those urls are [prefix][langKey][suffix].
                $translateProvider.useStaticFilesLoader({
                    prefix: 'l10n/',
                    suffix: '.js'
                });
                // Tell the module what language to use by default
                $translateProvider.preferredLanguage('en');
                // Tell the module to store the language in the local storage
                $translateProvider.useLocalStorage();
            }])

            //add constant for login
            .constant('USER_ROLES', {
                all : '*',
                admin : 'admin',
                editor : 'editor',
                guest : 'guest'
            })
            .constant('AUTH_EVENTS', {
                loginSuccess : 'auth-login-success',
                loginFailed : 'auth-login-failed',
                logoutSuccess : 'auth-logout-success',
                sessionTimeout : 'auth-session-timeout',
                notAuthenticated : 'auth-not-authenticated',
                notAuthorized : 'auth-not-authorized'
            })

            //global configurations
            .constant('Config',{
                serverUrl : "http://localhost:8888/"
            })
            /* Adding the auth interceptor here, to check every $http request*/
            .config(function ($httpProvider) {
                $httpProvider.interceptors.push([
                    '$injector',
                    function ($injector) {
                        console.log($injector);
                        return $injector.get('AuthInterceptor');
                    }
                ]);
            })


    ;