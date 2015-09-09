'use strict';
app.factory('Auth', [ '$http', '$rootScope', '$window', 'Session', 'AUTH_EVENTS', 'Config',
	function($http, $rootScope, $window, Session, AUTH_EVENTS, Config) {
		var authService = {};


		//the login function
		authService.login = function(user, success, error) {

			//$http.post('misc/users.json').success(function(data) {
			$http.post(Config.serverUrl + 'admin/checkLogin', user).success(function(data) {

				//this is my dummy technique, normally here the
				//user is returned with his data from the db
				//var users = data.users;

				//login success

				if(data !== null && data.username == user.username){
					//var loginData = users[user.username];
					var loginData = user;
					loginData.userRole = data.userRole;

					//set the browser session, to avoid relogin on refresh
					$window.sessionStorage["userInfo"] = JSON.stringify(loginData);

					//delete password not to be seen clientside
					delete loginData.password;

					//update current user into the Session service or $rootScope.currentUser
					//whatever you prefer
					Session.create(loginData);
					//or
					$rootScope.currentUser = loginData;

					//fire event of successful login
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					//run success function
					success(loginData);
                    //
					//if(user.username == loginData.username && user.password == loginData.username){
					//	//set the browser session, to avoid relogin on refresh
					//	$window.sessionStorage["userInfo"] = JSON.stringify(loginData);
                    //
					//	//delete password not to be seen clientside
					//	delete loginData.password;
                    //
					//	//update current user into the Session service or $rootScope.currentUser
					//	//whatever you prefer
					//	Session.create(loginData);
					//	//or
					//	$rootScope.currentUser = loginData;
                    //
					//	//fire event of successful login
					//	$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					//	//run success function
					//	success(loginData);
					//} else{
					//	//OR ELSE
					//	//unsuccessful login, fire login failed event for
					//	//the according functions to run
					//	console.log(" password wrong");
					//	$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
					//	error();
					//}
				}
				else{
					alert("username does not exist");
				}
			});

		};

		//check if the user is authenticated
		authService.isAuthenticated = function() {
			return !!Session.user;
		};

		//check if the user is authorized to access the next route
		//this function can be also used on element level
		//e.g. <p ng-if="isAuthorized(authorizedRoles)">show this only to admins</p>
		authService.isAuthorized = function(authorizedRoles) {
			console.log("####" + Session.userRole);
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			console.log("authService.isAuthenticated "+ authService.isAuthenticated());
			return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(Session.userRole) !== -1);
		};

		//log out the user and broadcast the logoutSuccess event
		authService.logout = function(){
			console.log("logout");
			console.log($window.sessionStorage);

			Session.destroy();
			$window.sessionStorage.removeItem("userInfo");
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		}

		return authService;
	} ]);