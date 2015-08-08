'use strict';
var $localhost="http://172.16.12.208:9200";
var $postfix="/_all/_search?pretty";
var $requestUrl=$localhost+$postfix;
app.controller('testController', ['$scope', '$http','$localStorage', '$timeout', '$animate','$stateParams', function ($scope, $http,$alerts, $timeout, $animate,$stateParams) {
    //$scope.testId="ddd";
    $scope.testId=$stateParams.telNumber;

    $scope.testJsonp=function(){
        //var $url="http://localhost/skidxjq/php/service.php";
        //$http.get($url).success(function(data){
        //    console.log(data);
        //});
        var $url="http://localhost/skidxjq/php/service.php?callback=JSON_CALLBACK";
        $http.jsonp($url).success(function(data){
            console.log(data);
            var $jsonData=eval(data);
            console.log($jsonData);rm
        });
    }
    $scope.testJsonp();
}
]);
