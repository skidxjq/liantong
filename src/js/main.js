'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$translate','$state',  '$rootScope', '$localStorage', '$window', 'Auth', 'AUTH_EVENTS','USER_ROLES', 'Session',
      function($scope,   $translate, $state, $rootScope,  $localStorage,   $window, Auth, AUTH_EVENTS, USER_ROLES, Session ) {
        // add 'ie' classes to html
        var isIE = !!navigator.userAgent.match(/MSIE/i);
        isIE && angular.element($window.document.body).addClass('ie');
        isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');
        console.log("main.js into main");
        // config
        $scope.app = {
          name: '联通反欺诈大数据分析平台',
          version: '1.3.3',
          // for chart colors
          color: {
            primary: '#7266ba',
            info:    '#23b7e5',
            success: '#27c24c',
            warning: '#fad733',
            danger:  '#f05050',
            light:   '#e8eff0',
            dark:    '#3a3f51',
            black:   '#1c2b36'
          },
          settings: {
            themeID: 1,
            navbarHeaderColor: 'bg-black',
            navbarCollapseColor: 'bg-white-only',
            asideColor: 'bg-black',
            headerFixed: true,
            asideFixed: false,
            asideFolded: false,
            asideDock: false,
            container: false
          }
        }

        // save settings to local storage
        if ( angular.isDefined($localStorage.settings) ) {
          $scope.app.settings = $localStorage.settings;
        } else {
          $localStorage.settings = $scope.app.settings;
        }
        $scope.$watch('app.settings', function(){
          if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
            // aside dock and fixed must set the header fixed.
            $scope.app.settings.headerFixed = true;
          }
          // save to local storage
          $localStorage.settings = $scope.app.settings;
        }, true);

        // angular translate
        $scope.lang = { isopen: false };
        $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
        $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
        $scope.setLang = function(langKey, $event) {
          // set the current lang
          $scope.selectLang = $scope.langs[langKey];
          // You can change the language during runtime
          $translate.use(langKey);
          $scope.lang.isopen = !$scope.lang.isopen;
        };

        function isSmartDevice( $window )
        {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        $scope.baseUrl="http://172.16.12.204:9200";
        $scope.baseDate="2015.06.03";
        $scope.requestUrl=$scope.baseUrl+"/anti-"+$scope.baseDate+"/_search?pretty";
        $scope.serverUrl="http://localhost:8888";
        /*
         * 清空数组
         * */

        $scope.setArrayEmpty=function($arr){
          $arr.splice(0,$arr.length);//清空数组重新绘制

        };
        //$localhost+"/anti-"+$date+"/_search?pretty";

        //控制登陆相关
        var setCurrentUser = function(){
          $scope.currentUser = $rootScope.currentUser;
        }

        var showNotAuthorized = function(){
          alert("Not Authorized");
        };

        var showLogOut = function(){
          alert("log out");
          $state.go('access.signin');
        };

        var showLoginFailed = function(){
          alert("username or password wrong");

        };

        //$scope.loginUser = ;
        //console.log(Session);

        $scope.getUserName = function(){

          console.log("main.js getUserName");
          console.log($window.sessionStorage.getItem("userInfo"));
          $scope.$apply();

          return $window.sessionStorage.getItem("userInfo").userName;
        };

        $scope.loginUser = $scope.getUserName();
        //$scope.$apply();


        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = Auth.isAuthorized;

        //listen to events of unsuccessful logins, to run the login dialog
        $rootScope.$on(AUTH_EVENTS.notAuthorized, showNotAuthorized);
        //$rootScope.$on(AUTH_EVENTS.notAuthenticated, showLoginDialog);
        //$rootScope.$on(AUTH_EVENTS.sessionTimeout, showLoginDialog);
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, showLogOut);
        $rootScope.$on(AUTH_EVENTS.loginSuccess, setCurrentUser);
        $rootScope.$on(AUTH_EVENTS.loginFailed, showLoginFailed);

        $scope.userToggle = function(obj) {
          $("#userLogout").toggleClass("open");

        }

      }]);