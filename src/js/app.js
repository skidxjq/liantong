'use strict';

angular.module('showcase.withAjax', ['datatables']);
angular.module('showcase.userEvalute', ['datatables']);
angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'iu',
    'paging',
    //'datatables',
    'showcase.withAjax',
    'showcase.userEvalute'
]);

