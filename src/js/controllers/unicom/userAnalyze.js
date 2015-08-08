//'use strict';
//var $localhost="http://172.16.12.208:9200";
//var $postfix="/_all/_search?pretty";
//var $requestUrl=$localhost+$postfix;

//var $localhost="http://172.16.12.208:9200";
//var $date="2015.04.29";
//
//var $requestUrl=$localhost+"/anti-"+$date+"/_search?pretty"
app.controller('userAnalyzeController', ['$scope', '$http','$localStorage', '$timeout', '$animate', function ($scope, $http,$alerts, $timeout, $animate) {
    $scope.tableloading=true;
    $scope.roleArr={0:"正常",1:"异常"};

    $scope.currentPage=1;
    $scope.pageSize=50;
    $scope.total=0;


    $scope.getUserTable=function(){
        //$http.get()
        $http.post($scope.requestUrl,{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"_type:ring-stat"}}]}},"filter":{"bool":{"must":[{"match_all":{}}]}}}},"highlight":{"fields":{},"fragment_size":2147483647,"pre_tags":["@start-highlight@"],"post_tags":["@end-highlight@"]},"size":100,"sort":[{"number":{"order":"desc","ignore_unmapped":"true"}}]}).success(function(response){
            var $countJson=eval(response);
            $scope.userTableJson=$countJson.hits.hits;
            $scope.userTableLength=$scope.userTableJson.length;
            $scope.tableloading=false;
            console.log($scope.userTableLength);
            //$scope.disturbTotalTime=$countJson.facets.stats.total;


        })
    };
    $scope.getUsers=function($page){
        if(typeof $page ==='undefined') $page=0;
        console.log("getUsers");
        $http.get($scope.serverUrl+'/users/getUserList/'+$page)
            .success(function(response){
                $scope.userTable=response;
                console.log($scope.userTable);
                console.log("success");
                scrollTo(0,0);

            })
            .error(function(err){
                console.log("error");
            })


    };
    $scope.getTotal=function(){
        $http.get($scope.serverUrl+'/users/getUsersSum')
            .success(function(response){
                $scope.total=response.total;
                console.log("sum success");
            })
            .error(function(err){

            });
    }
    $scope.getUsers();
    $scope.getTotal();

    $scope.visible=false;
    //$scope.getUserTable();

    $scope.isObjNull=function(jsonArr){
        console.log(jsonArr);
        if(jsonArr.length==0){
            console.log(0);
            return false;
        }else{
            console.log(1);
            return true;
        }
    };


    $scope.pageClick=function(){

    };

    /*
    * 点击page，进行翻页
    *
    * */
    $scope.changePage=function(){

        var event = event || window.event,page;
        if (!isNaN(event.target.innerText)){

            page = event.target.innerText-1;
            $scope.getUsers(page)

        }

    }
}
]);
