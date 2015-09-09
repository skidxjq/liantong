'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController',
    ['$scope', '$http', '$state', 'Auth', '$window', function($scope, $http, $state, Auth, $window) {

        //['$scope', '$http', '$state', function($scope, $http, $state) {
        //$scope.user = {};
        //$scope.authError = null;
        //$scope.login = function() {
        //  $scope.authError = null;
        //  // Try to login
        //  $http.post('api/login', {email: $scope.user.email, password: $scope.user.password})
        //  .then(function(response) {
        //    if ( !response.data.user ) {
        //      $scope.authError = 'Email or Password not right';
        //    }else{
        //      $state.go('app.dashboard-v1');
        //    }
        //  }, function(x) {
        //    $scope.authError = 'Server Error';
        //  });
        //};
        //
        //$scope.credentials = {};
        //$scope.loginForm = {};
        //$scope.error = false;
        //
        ////when the form is submitted
        //$scope.submit = function() {
        //    $scope.submitted = true;
        //    if (!$scope.loginForm.$invalid) {
        //        $scope.login($scope.credentials);
        //    } else {
        //        $scope.error = true;
        //        return;
        //    }
        //};

        //Performs the login function, by sending a request to the server with the Auth service
        $scope.guest = {"username" : "guest", "password" : "guest" };
        $scope.login = function(credentials) {

            console.log(credentials);
            $scope.error = false;
            Auth.login(credentials, function(user) {

                //success function
                //$modalInstance.close();
                console.log(user);
                $state.go('app.overview');

            }, function(err) {
                console.log("error");
                $scope.error = true;
            });
        };

        // if a session exists for current user (page was refreshed)
        // log him in again
        if ($window.sessionStorage["userInfo"]) {
            var credentials = JSON.parse($window.sessionStorage["userInfo"]);
            $scope.login(credentials);
        }

    }])
;