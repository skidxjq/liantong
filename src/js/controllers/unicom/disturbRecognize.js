'use strict';
var $localhost="http://172.16.12.208:9200";
var $date="2015.04.29";
var $requestUrl=$localhost+"/anti-"+$date+"/_search?pretty";
app.controller('disturbRecognizeController', ['$scope', '$http','$localStorage', '$timeout', '$animate', function ($scope, $http,$alerts, $timeout, $animate) {
    $scope.colorSet=['#7266ba','#23b7e5','#27c24c','#fad733','#f05050','#e6f4c1','#d9d6a3','#98b692','#c23b5b','#0f3355'];
    $scope.districtPieData=[]
    $scope.timeLineData={dataOne:[],dataTwo:[],dataThree:[],dataFour:[]};
    $scope.timeLineDataMap=[];
    $scope.pieChange=0;
    $scope.d0_1 = [ [0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7] ];
    //$scope.typeArr={0:"正常",1:"骚扰",2:"黑卡",3:"高吸费"};

    $scope.d0_2 = [ [0,4],[1,4.5],[2,7],[3,4.5],[4,3],[5,3.5],[6,6],[7,3],[8,4],[9,3] ];
    var $districtMapApi,$chartCityApi,          data = [2.0, 4.9, 7.0, 23.2, 25.6, 760.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 20];

    //骚扰电话列表
    $scope.getCallingList=function(){
        $http.post($requestUrl,{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-stat.role:\"1\""}}]}},"filter":{"bool":{"must":[{"match_all":{}}]}}}},"highlight":{"fields":{},"fragment_size":2147483647,"pre_tags":["@start-highlight@"],"post_tags":["@end-highlight@"]},"size":500,"sort":[{"number":{"order":"desc","ignore_unmapped":true}}]}).success(function(response){
            var $countJson=eval(response);
            $scope.userTableJson=$countJson.hits.hits;


        })
    }
    $scope.dataJson={"aaData":[
        {
            "engine": "Trident",
            "browser": "Internet Explorer 4.0",
            "platform": "Win 95+",
            "version": "4",
            "grade": "X"
        },
        {
            "engine": "Trident",
            "browser": "Internet Explorer 5.0",
            "platform": "Win 95+",
            "version": "5",
            "grade": "C"
        }]};

    $scope.getCallingList();
    //$districtMapApi.refresh();w
    //$scope.pieChage++;






}
]);
