'use strict';
//var $localhost="http://172.16.12.208:9200";
//var $date="2015.04.29";
//
//var $scope.requestUrl=$localhost+"/anti-"+$date+"/_search?pretty";
app.controller('userEvaluateController', ['$scope','$http','$localStorage', '$timeout', '$animate','$stateParams', function ($scope, $http,$alerts, $timeout, $animate,$stateParams) {
    $scope.callingCount = "";   //通话次数
    $scope.averageTime="";      //平均通话时长
    $scope.countJson="";
    $scope.dataChange=0;
    $scope.tableLoading=true;   //底部表格开始时候显示正在加载中
    $scope.userCredit=0;        //号码的信用评级
    $scope.typeArr={0:"主叫",1:"被叫"};
    $scope.roleArr={0:"正常",1:"异常"};
    $scope.locations="";
    //$scope.dataMap=
    $scope.telNumber=$stateParams.telNumber;
    $scope.barData={"callingBar":[[0,0]],"callingPeriod":[[0,0]],dataMap:[],change:0};    //
    //$scope.barData.callingBar=[[0,0]];
    //$scope.d0_1 = [ [0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7] ];

    $scope.getCallCount=function(){
        var $params={
            "facets": {
                "stats": {
                    "statistical": {
                        "field": "callingCount"
                    },
                    "facet_filter": {
                        "fquery": {
                            "query": {
                                "filtered": {
                                    "query": {
                                        "bool": {
                                            "should": [
                                                {
                                                    "query_string": {
                                                        "query": "ring-stat.number:"+$scope.telNumber
                                                    }
                                                },
                                                {
                                                    "query_string": {
                                                        "query": "ring-log.callingNumber:"+$scope.telNumber
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "filter": {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_all": {}
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "stats_ring-stat.number:13007220168": {
                    "statistical": {
                        "field": "callingCount"
                    },
                    "facet_filter": {
                        "fquery": {
                            "query": {
                                "filtered": {
                                    "query": {
                                        "bool": {
                                            "should": [
                                                {
                                                    "query_string": {
                                                        "query": "ring-stat.number:"+$scope.telNumber
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "filter": {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_all": {}
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "stats_ring-log.callingNumber:$scope.telNumber": {
                    "statistical": {
                        "field": "callingCount"
                    },
                    "facet_filter": {
                        "fquery": {
                            "query": {
                                "filtered": {
                                    "query": {
                                        "bool": {
                                            "should": [
                                                {
                                                    "query_string": {
                                                        "query": "ring-log.callingNumber:"+$scope.telNumber
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "filter": {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_all": {}
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "size": 0
        };
        //alert($params);
        $http.post($scope.requestUrl,$params).success(function(response){
            $scope.countJson=eval(response);
            $scope.callingCount=$scope.countJson.facets.stats.total;

        });
        //            $http.get("http://www.w3cschool.cc/try/angularjs/data/Customers_JSON.php")
        //                .success(function(response) {$scope.user = response;});
        //            $http.get('test.xml').success(function(response){
        //                $scope.user=response;
        //            })
    }
    //$scope.get
    $scope.getAverageTime=function(){
        var $params={
            "facets": {
                "stats": {
                    "statistical": {
                        "field": "avgElapsed"
                    },
                    "facet_filter": {
                        "fquery": {
                            "query": {
                                "filtered": {
                                    "query": {
                                        "bool": {
                                            "should": [
                                                {
                                                    "query_string": {
                                                        "query": "ring-stat.number:"+$scope.telNumber
                                                    }
                                                },
                                                {
                                                    "query_string": {
                                                        "query": "ring-log.callingNumber:"+$scope.telNumber
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "filter": {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_all": {}
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "stats_ring-stat.number:$scope.telNumber": {
                    "statistical": {
                        "field": "avgElapsed"
                    },
                    "facet_filter": {
                        "fquery": {
                            "query": {
                                "filtered": {
                                    "query": {
                                        "bool": {
                                            "should": [
                                                {
                                                    "query_string": {
                                                        "query": "ring-stat.number:$scope.telNumber"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "filter": {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_all": {}
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "stats_ring-log.callingNumber:$scope.telNumber": {
                    "statistical": {
                        "field": "avgElapsed"
                    },
                    "facet_filter": {
                        "fquery": {
                            "query": {
                                "filtered": {
                                    "query": {
                                        "bool": {
                                            "should": [
                                                {
                                                    "query_string": {
                                                        "query": "ring-log.callingNumber:"+$scope.telNumber
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "filter": {
                                        "bool": {
                                            "must": [
                                                {
                                                    "match_all": {}
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "size": 0
        };
        $http.post($scope.requestUrl,$params).success(function(response){
            $scope.countJson=eval(response);
            $scope.averageTime=$scope.countJson.facets.stats.total;
        })
    }

    $scope.getCallingBar=function(){
        $http.post($scope.requestUrl,{"facets":{"1":{"date_histogram":{"field":"startTime","interval":"1d"},"global":true,"facet_filter":{"fquery":{"query":{"filtered":{"query":{"query_string":{"query":"ring-log.callingNumber:"+$scope.telNumber}},"filter":{"bool":{"must":[{"match_all":{}}]}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var $callingBarSet=$countJson.facets[1].entries;

            var $barTmpData={};
            for(var $i=0;$i<$callingBarSet.length;$i++){
                //var $objDate=$scope.timeStampToDate($callingBarSet[$i].time);
                //var $objDayArr=$objDate.split("/");
                //var $objDay=$objDayArr[2];
                //$scope.barData.callingBar.push([$objDay,$callingBarSet[$i].count]);
                //$scope.barData.callingBar.push([$callingBarSet[$i].time,$callingBarSet[$i].count]);
                $barTmpData[$callingBarSet[$i].time]=$callingBarSet[$i].count;
                $scope.barData.dataMap.push([$callingBarSet[$i].time,$scope.timeStampToDate($callingBarSet[$i].time)]);
            }
            $scope.barData.callingBar=$scope.barDatainitTial(1412812800000,10,$barTmpData);
            console.log($scope.barData.callingBar);
            $scope.tonghuaqushiOption.series[0].data=$scope.barData.callingBar;
            $scope.tonghuaqushiOption.version++;
            console.log($scope.tonghuaqushiOption);
            //$scope.dataChange++;

        })
    }

    //获取号码信用评级如  0.92
    $scope.getCreditNumber=function($number){
        var $params={
            "query": {
                "filtered": {
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "number:"+$scope.telNumber
                                    }
                                }
                            ]
                        }
                    },
                    "filter": {
                        "bool": {
                            "must": [
                                {
                                    "match_all": {}
                                }
                            ]
                        }
                    }
                }
            },
            "highlight": {
                "fields": {},
                "fragment_size": 2147483647,
                "pre_tags": [
                    "@start-highlight@"
                ],
                "post_tags": [
                    "@end-highlight@"
                ]
            },
            "size": 500,
            "sort": [
                {
                    "credit": {
                        "order": "desc",
                        "ignore_unmapped": true
                    }
                }
            ]
        };
        $http.post("http://172.16.12.208:9200/anti-test/_search?pretty",$params).success(function(response) {
            var $countJson = eval(response);
            //var $callingBarSet=$countJson.facets[1].entries;
            try {
                $countJson["hits"]["hits"][0]["_source"]["credit"] == null ? "" : $scope.userCredit = $countJson["hits"]["hits"][0]["_source"]["credit"];
            }catch(err){
                console.log(err);
                //$scope.userCredit =0;
            }
            //    $scope.userCredit =0;

        })
    }


    //
    $scope.barDatainitTial=function($lastTime,$days,$barTmpData){
        var $arr=[];
        var $step= 86400000;
        var $i=0;
        for(;$i<$days;$i++){
            //$arr.push([$lastTime-$i*$step,$barTmpData[$lastTime-$i*$step]==null?0:$barTmpData[$lastTime-$i*$step]]);
            $arr.push($barTmpData[$lastTime-$i*$step]==null?0:$barTmpData[$lastTime-$i*$step]);
            //$arr.push($barTmpData[$lastTime-$i*$step]==null?0:$barTmpData[$lastTime-$i*$step]);
            //$scope.barData.dataMap.push([$lastTime-$i*$step,$scope.timeStampToDate($lastTime-$i*$step)]);
        }
        return $arr.reverse();

    }
    $scope.lineDataInitial=function($lineTmpData){
        var $arr=[];
        for(var $i=0;$i<24;$i++){
            $arr.push($lineTmpData[$i]==null?0:$lineTmpData[$i]);
        }
        return $arr
    }

    $scope.getCallingPeriod=function(){
        $scope.barData.callingPeriod=[];
        $http.post($scope.requestUrl,{"facets":{"terms":{"terms":{"field":"callPeriod","size":24,"order":"term","exclude":[]},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.callingNumber:"+$scope.telNumber}}]}},"filter":{"bool":{"must":[{"match_all":{}}]}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var $callingBarSet=$countJson.facets.terms.terms;
            for(var $i=0;$i<$callingBarSet.length;$i++){
                //$scope.barData.callingPeriod.push([$callingBarSet[$i].term,$callingBarSet[$i].count]);
                //$scope.barData.callingPeriod[$callingBarSet[$i].term]=([$callingBarSet[$i].term,$callingBarSet[$i].count]);
                $scope.barData.callingPeriod[$callingBarSet[$i].term]=$callingBarSet[$i].count;
                console.log($scope.barData.callingPeriod);
                $scope.tonghuashiduanOption.series[0].data=$scope.lineDataInitial($scope.barData.callingPeriod);
                $scope.tonghuashiduanOption.version++;
                //$scope.barData.dataMap.push([$callingBarSet[$i].time,$scope.timeStampToDate($callingBarSet[$i].time)]);
            }
            //   console.log($scope.barData.callingPeriod);
            $scope.dataChange++;

        })
    }

    $scope.getUserTable=function(){
        $http.post($scope.requestUrl,{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.callingNumber:"+$scope.telNumber}}]}},"filter":{"bool":{"must":[{"match_all":{}}]}}}},"highlight":{"fields":{},"fragment_size":2147483647,"pre_tags":["@start-highlight@"],"post_tags":["@end-highlight@"]},"size":500,"sort":[{"startTime":{"order":"desc","ignore_unmapped":true}}]}).success(function(response){
            var $countJson=eval(response);
            $scope.userTableJson=$countJson.hits.hits;
            $scope.userTableLength=$scope.userTableJson.length;
            $scope.tableloading=false;
            console.log($scope.userTableLength+1);
            //$scope.disturbTotalTime=$countJson.facets.stats.total;


        })
    }

    //获取归属地和用户正常与否的role
    $scope.getLocation=function($number){
        var $params={
            "query": {
                "filtered": {
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "query_string": {
                                        "query": "ring-stat.number:"+$number
                                    }
                                }
                            ]
                        }
                    },
                    "filter": {
                        "bool": {
                            "must": [
                                {
                                    "match_all": {}
                                }
                            ]
                        }
                    }
                }
            },
            "highlight": {
                "fields": {},
                "fragment_size": 2147483647,
                "pre_tags": [
                    "@start-highlight@"
                ],
                "post_tags": [
                    "@end-highlight@"
                ]
            },
            "size": 500,
            "sort": [
                {
                    "_score": {
                        "order": "desc",
                        "ignore_unmapped": true
                    }
                }
            ]
        };
        $http.post($scope.requestUrl,$params).success(function(response){
            var $countJson=eval(response);
            //var $callingBarSet=$countJson.facets[1].entries;
            var $unit=$countJson["hits"]["hits"][0]["_source"];
            if($unit["location"]==null){
                $scope.locations="不明";
            }else if($unit["location"]["province"]!=$unit["location"]["city"]){
                $scope.locations=$unit["location"]["province"]+$unit["location"]["city"];

            }else{
                $scope.locations=$unit["location"]["province"];
            }
            $scope.role=$unit["role"]!=null?$scope.roleArr[$unit["role"]]:"不明";

        })

    }

    var tonghuaqushiApi;
    $scope.tonghuaqushiOption = {
        version: 1,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['通话趋势'],
            y: 'bottom'
        },
        toolbox: {
            show: false
        },
        grid: {
            x: 30,
            y: 10,
            x2: 10,
            y2: 55
        },
        padding: 0,
        calculable: true,
        xAxis: [
            {
                axisLabel: {
                    interval: 0
                },
                type: 'category',
                data: ['2014-09-30','2014-10-01','2014-10-02','2014-10-03','2014-10-04','2014-10-05','2014-10-06','2014-10-07','2014-10-08','2014-10-09']
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show: true}
            }
        ],
        series: [
            {
                name: '通话次数',
                type: 'bar',
                data: []
            }

        ],
        onRegisterApi: function (chartApi) {
            tonghuaqushiApi = chartApi;
        }
    };


    var tonghuashiduanApi;
    $scope.tonghuashiduanOption = {
        version: 1,
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: false
        },
        grid: {
            x: 30,
            y: 10,
            x2: 10,
            y2: 55
        },
        padding: 0,
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show: true}
            }
        ],
        series: [
            {
                name: '通话时段分布',
                type: 'line',
                smooth: false,
                data: []
            }

        ],
        onRegisterApi: function (chartApi) {
            tonghuashiduanApi = chartApi;
        }
    };

    $scope.timeStampToDate=function (nS) {
        return new Date(parseInt(nS)).toLocaleString().substr(0,10);
    }
    $scope.getCallCount();
    $scope.getCallingBar();
    $scope.getCallingPeriod();
    $scope.getAverageTime();
    $scope.getUserTable();
    $scope.getCreditNumber($scope.telNumber);
    $scope.getLocation($scope.telNumber);





}
]);
