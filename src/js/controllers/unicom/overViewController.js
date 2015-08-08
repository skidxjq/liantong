'use strict';

/*
 * 原型扩展
 * 删除数组中的重复项
 * */
Array.prototype.del = function() {
    var a = {}, c = [], l = this.length;
    for (var i = 0; i < l; i++) {
        var b = this[i];
        //console.log(b);
        var d = (typeof b) + b;
        //console.log(d);
        //console.log(a[d]);
        if (a[d] === undefined) {
            c.push(b);
            a[d] = 1;
            //console.log(a);
        }
    }
    return c;
};

app.controller('overViewController', ['$scope', '$http','$localStorage', '$timeout', '$animate','$stateParams', function ($scope, $http,$alerts, $timeout, $animate,$stateParams) {

    $scope.legend=['正常','骚扰电话','黑卡','高吸费电话'];
    $scope.pieDataLegend=[
        {"color":"#7266ba","term":"正常"},
        {"color":"#23b7e5","term":"骚扰电话"},
        {"color":"#27c24c","term":"高吸费电话"},
        {"color":"black","term":"黑卡"} 
    ]

    $scope.data={
        "pieDataOne":[] ,//第一个饼图数据
        "pieDataTwo":[] ,//第2个饼图数据
        "pieDataThree":[] ,//第3个饼图数据
        "dataOne":[],
        "dataTwo":[],
        "dataThree":[]

        
    };
    $scope.info={
        "totalCallingCount":"", //总通话次数
        "callingNum":"",//主叫号码个数
        "disturbCount":"", //骚扰电话个数
        "blackCardCount":"", //黑卡识别个数
        "cheatCount":""//欺诈个数
    };
    $scope.dataMap={
        "timeLineDataMap":[]  ,      //横轴坐标时间戳
        "timeLineDataMapToDate":[],  //转化为正确日期
        "lineDataOne":[],
        "lineDataTwo":[],
        "lineDataThree":[]
    }
    $scope.echarts={
        "options":{
            "pieDataOneOption":{},
            "pieDataTwoOption":{},
            "pieDataThreeOption":{}
        },
        "api":{

        }
    };


    $scope.isTimeRange=false;
    /*
     * 这里设置考虑到时间戳，如果有时间范围选择查询
     * */
    $scope.timeRangeStr=$scope.isTimeRange==true?'"{range":{"timestamp":{"from":'+$scope.minDate+',"to":'+$scope.maxDate+'}}}':[];
    /*
     * 判断日期 今天、昨天、过去七天etc
     *
     * */
    $scope.timeRangeArr={"today":1,"yesterday":2,"lastweek":7,"lastmonth":30};
    console.log($stateParams.datetime);

    //饼图的legend对应
    var $pieLegend=["正常","骚扰电话","高吸费电话","黑卡"];
    $scope.getCallCount=function(){
        $http.post($scope.requestUrl,{"facets":{"stats":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"_type:ring-log"}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"stats__type:ring-log":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"_type:ring-log"}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            $scope.info.totalCallingCount=$countJson.facets.stats.count;


        })
    }

    $scope.getCallingNum=function(){
        $http.post($scope.requestUrl,{"facets":{"stats":{"statistical":{"field":"callingCount"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"_type:ring-stat"}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"stats__type:ring-stat":{"statistical":{"field":"callingCount"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"_type:ring-stat"}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            $scope.countJson=eval(response);
            $scope.info.callingNum=$scope.countJson.facets.stats.count;
        })
    }
    $scope.getDisturbCount=function(){
        $http.post($scope.requestUrl,{"facets":{"stats":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-stat.role:\"1\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"stats_ring-stat.role:\"1\"":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-stat.role:\"1\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            $scope.info.disturbCount=$countJson.facets.stats.count;
        })
    }
    $scope.getBlackCardCount=function(){
        $http.post($scope.requestUrl,{"facets":{"stats":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.role:\"2\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"stats_ring-log.role:\"2\"":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.role:\"2\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            $scope.info.blackCardCount=$countJson.facets.stats.count;
        })
    }

    $scope.getCheatCount=function(){
        $http.post($scope.requestUrl,{"facets":{"stats":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.role:\"3\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"stats_ring-log.role:\"3\"":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.role:\"3\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            $scope.info.cheatCount=$countJson.facets.stats.count;
        })
    }
    $scope.getPieDataOne=function(){
        $scope.pieDataOneApi?$scope.pieDataOneApi.showLoading("正在加载中"):"";

        $http.post($scope.requestUrl,{"facets":{"terms":{"terms":{"field":"role","size":10,"order":"count","exclude":[]},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"_type:ring-log"}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var $pieDataOne=$countJson.facets.terms.terms;
            $scope.setArrayEmpty($scope.data.pieDataOne);
            for(var $i=0;$i<$pieDataOne.length;$i++){
                $scope.data.pieDataOne.push({value:$pieDataOne[$i].count,name:$scope.legend[$i]});
            }
            $scope.echarts.options.pieDataOneOption.version++;
        })
    }

    $scope.getPieDataTwo=function(){
        $scope.data.pieDataTwoApi?$scope.data.pieDataTwoApi.showLoading("正在加载中"):"";

        $http.post($scope.requestUrl,{"facets":{"terms":{"terms":{"field":"role","size":10,"order":"count","exclude":[]},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"_type:ring-stat"}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var pieDataTwo=$countJson.facets.terms.terms;
            $scope.setArrayEmpty($scope.data.pieDataTwo);
            for(var $i=0;$i<pieDataTwo.length;$i++){
                $scope.data.pieDataTwo.push({value:pieDataTwo[$i].count,name:$scope.legend[$i]});
            }
            $scope.echarts.options.pieDataTwoOption.version++;
        })

    }

    $scope.getPieDataThree=function(){
        $scope.data.pieDataThreeApi?$scope.data.pieDataThreeApi.showLoading("正在加载中"):"";
        $http.post($scope.requestUrl,{"facets":{"terms":{"terms_stats":{"value_field":"elapsedTime","key_field":"role","size":10,"order":"term"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"_type:ring-log"}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var pieDataThree=$countJson.facets.terms.terms;
            $scope.setArrayEmpty($scope.data.pieDataThree);
            for(var $i=0;$i<pieDataThree.length;$i++){
                $scope.data.pieDataThree.push({value:pieDataThree[$i].count,name:$scope.legend[$i]});
            }
            $scope.echarts.options.pieDataThreeOption.version++;
        })
    };
    $scope.getTimeLine=function(){
        $scope.timeLineDataApi?$scope.timeLineDataApi.showLoading("正在加载中"):"";

        $http.post($scope.requestUrl,{"facets":{"0_3":{"date_histogram":{"field":"timestamp","interval":"1d"},"global":true,"facet_filter":{"fquery":{"query":{"filtered":{"query":{"query_string":{"query":"ring-log.role:\"0\""}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"1_6":{"date_histogram":{"field":"timestamp","interval":"1d"},"global":true,"facet_filter":{"fquery":{"query":{"filtered":{"query":{"query_string":{"query":"ring-log.role:\"1\""}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"2_4":{"date_histogram":{"field":"timestamp","interval":"1d"},"global":true,"facet_filter":{"fquery":{"query":{"filtered":{"query":{"query_string":{"query":"ring-log.role:\"2\""}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"3_5":{"date_histogram":{"field":"timestamp","interval":"1d"},"global":true,"facet_filter":{"fquery":{"query":{"filtered":{"query":{"query_string":{"query":"ring-log.role:\"3\""}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var timeLineJsonOne=$countJson.facets["0_3"].entries;
            /*
             * 选择时间周期后，需要重新绘图，清空之前的数组
             * */
            //$scope.setArrayEmpty($scope.data.dataOne);
            //$scope.setArrayEmpty($scope.data.dataTwo);
            //$scope.setArrayEmpty($scope.data.dataThree);
            $scope.data.dataOne={};
            $scope.data.dataTwo={};
            $scope.data.dataThree={};
            $scope.setArrayEmpty($scope.dataMap.lineDataOne);
            $scope.setArrayEmpty($scope.dataMap.lineDataTwo);
            $scope.setArrayEmpty($scope.dataMap.lineDataThree);
            $scope.setArrayEmpty($scope.dataMap.timeLineDataMap);
            $scope.setArrayEmpty($scope.dataMap.timeLineDataMapToDate);
            if(timeLineJsonOne.length==0){

            }
            for(var $i=0;$i<timeLineJsonOne.length;$i++){
                $scope.data.dataOne[timeLineJsonOne[$i].time]=timeLineJsonOne[$i].count;
                $scope.dataMap.timeLineDataMap.push(timeLineJsonOne[$i].time);
            }


            var timeLineJsonTwo=$countJson.facets["1_6"].entries;
            for(var $i=0;$i<timeLineJsonTwo.length;$i++){
                //$scope.data.dataTwo.push([timeLineJsonTwo[$i].time,timeLineJsonTwo[$i].count]);
                $scope.data.dataTwo[timeLineJsonTwo[$i].time]=timeLineJsonTwo[$i].count;
                $scope.dataMap.timeLineDataMap.push(timeLineJsonOne[$i].time);

            }

            var timeLineJsonThree=$countJson.facets["2_4"].entries;
            for(var $i=0;$i<timeLineJsonThree.length;$i++){
                $scope.data.dataThree[timeLineJsonThree[$i].time]=timeLineJsonThree[$i].count;
                $scope.dataMap.timeLineDataMap.push(timeLineJsonOne[$i].time);

            }
            console.log($scope.dataMap.timeLineDataMapToDate+"dd");
            $scope.dataMap.timeLineDataMap=$scope.dataMap.timeLineDataMap.sort().del();
            for(var $i=0;$i<$scope.dataMap.timeLineDataMap.length;$i++){
                $scope.data.dataOne[$scope.dataMap.timeLineDataMap[$i]]!=null?$scope.dataMap.lineDataOne.push( $scope.data.dataOne[$scope.dataMap.timeLineDataMap[$i]]):$scope.dataMap.lineDataOne.push(0);
                $scope.data.dataTwo[$scope.dataMap.timeLineDataMap[$i]]!=null?$scope.dataMap.lineDataTwo.push( $scope.data.dataTwo[$scope.dataMap.timeLineDataMap[$i]]):$scope.dataMap.lineDataTwo.push(0);
                $scope.data.dataThree[$scope.dataMap.timeLineDataMap[$i]]!=null?$scope.dataMap.lineDataThree.push( $scope.data.dataThree[$scope.dataMap.timeLineDataMap[$i]]):$scope.dataMap.lineDataThree.push(0);
                $scope.dataMap.timeLineDataMapToDate.push($scope.timeStampToDate($scope.dataMap.timeLineDataMap[$i]));

            }
            $scope.echarts.options.timeLineDataOption.xAxis[0].data=$scope.dataMap.timeLineDataMapToDate;

            $scope.echarts.options.timeLineDataOption.version++;
        })

    }

    $scope.timeStampToDate=function (nS) {
        return new Date(parseInt(nS)).toLocaleString().substr(0,10);
    };

    $scope.repaint=function(){
        $scope.getCallCount();
        $scope.getCallingNum();
        $scope.getDisturbCount();
        $scope.getBlackCardCount();
        $scope.getCheatCount();
        $scope.getPieDataOne();
        $scope.getPieDataTwo();
        $scope.getPieDataThree();
        $scope.getTimeLine();

    }
    //最终绘图下方
    $scope.repaint();


    //三个饼图开始
    $scope.echarts.options.pieDataOneOption = {
        version: 1,
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            data: $scope.legend,
            y: 'bottom'
        },
        toolbox: {
            show: false
        },

        padding: 0,
        calculable: true,

        series: [

            {
                name: '通话次数占比',
                type: 'pie',
                smooth: true,
                radius:'60%',
                itemStyle:{
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                center:['50%','40%'],
                data: $scope.data.pieDataOne
                //    [
                //    {value:335,name:'3G网络流量(GB)'},
                //    {value:333,name:'3G网络上周流量均值(GB)'},
                //    {value:0,name:'4G'},
                //    {value:0,name:'5G'}
                //]
            }
        ],
        onRegisterApi: function (chartApi) {
            $scope.pieDataOneApi = chartApi;
        }
    };
    $scope.echarts.options.pieDataTwoOption = {
        version: 1,
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            data: $scope.legend,
            y: 'bottom'
        },
        toolbox: {
            show: false
        },

        padding: 0,
        calculable: true,

        series: [

            {
                name: '通话号码占比',
                type: 'pie',
                smooth: true,
                radius:'60%',
                itemStyle:{
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                center:['50%','40%'],
                data: $scope.data.pieDataTwo
                //    [
                //    {value:335,name:'3G网络流量(GB)'},
                //    {value:333,name:'3G网络上周流量均值(GB)'},
                //    {value:0,name:'4G'},
                //    {value:0,name:'5G'}
                //]
            }
        ],
        onRegisterApi: function (chartApi) {
            $scope.data.pieDataTwoApi = chartApi;
        }
    };

    var pieDataThreeApi;
    $scope.echarts.options.pieDataThreeOption = {
        version: 1,
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            data: $scope.legend,
            y: 'bottom'
        },
        toolbox: {
            show: false
        },

        padding: 0,
        calculable: true,

        series: [

            {
                name: '通话时长占比',
                type: 'pie',
                smooth: true,
                radius:'60%',
                itemStyle:{
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                center:['50%','40%'],
                data: $scope.data.pieDataThree
                //    [
                //    {value:335,name:'3G网络流量(GB)'},
                //    {value:333,name:'3G网络上周流量均值(GB)'},
                //    {value:0,name:'4G'},
                //    {value:0,name:'5G'}
                //]
            }
        ],
        onRegisterApi: function (chartApi) {
            $scope.data.pieDataThreeApi = chartApi;
        }
    };

    var timeLineDataApi;
    $scope.echarts.options.timeLineDataOption = {
        version: 1,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['正常', '骚扰电话','黑卡','高吸费电话'],
            y: 'bottom'
        },
        toolbox: {
            show: false
        },
        grid: {
            x: 100,
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

                //data: $scope.dataMap.timeLineDataMapToDate
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
                name: '正常',
                type: 'line',
                smooth: true,
                data: $scope.dataMap.lineDataOne
            },
            {
                name: '骚扰电话',
                type: 'line',
                smooth: true,
                data: $scope.dataMap.lineDataTwo

            },
            {
                name: '黑卡',
                type: 'line',
                smooth: true,
                data: $scope.dataMap.lineDataThree

            }
        ],
        onRegisterApi: function (api) {
            $scope.timeLineDataApi = api;
        }
    };
    /*
     * 时间选择控件
     * */
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.minDateOpen = function($event) {
        console.log($event);
        $event.preventDefault();
        $event.stopPropagation();
        $scope.maxDateOpened = false;

        $scope.minDateOpened = true;

    };
    $scope.maxDateOpen = function($event) {
        console.log($event);

        $event.preventDefault();
        $event.stopPropagation();

        $scope.minDateOpened = false;
        $scope.maxDateOpened = true;
    };


    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    /*
     * 根据最小最大时间查询整个界面
     * */
    $scope.queryByTimeRange=function($datetime) {
        $scope.isTimeRange = true;

        if (!$datetime) {
            console.log("queryTime");
            console.log($scope.dt_min);
            $scope.minDate = Date.parse($scope.dt_min);
            $scope.maxDate = Date.parse($scope.dt_max);

        } else {
            //如果是点击今天昨天过去七天 etc
            $scope.maxDate=Number(new Date());
            $scope.minDate=Number(new Date()-86400000*$scope.timeRangeArr[$datetime]);
            console.log($scope.maxDate);
            console.log($scope.minDate);
        }
        $scope.timeRangeStr = $scope.isTimeRange == true ? {
            "range": {
                "timestamp": {
                    "from": $scope.minDate,
                    "to": $scope.maxDate
                }
            }
        } : [];
        $scope.repaint();
    };



    /*
     * 日期转时间戳
     * yyyy-mm-dd=>1234568
     * */
    $scope.dateToTimestamp=function($datetime){
        console.log(Date.parse("2013/02/02"));
        var newstr = $datetime.replace(/-/g,'/');
        var date =  new Date(newstr);
        var time_str = date.getTime().toString();
        return Number(time_str)+86400000;
        //return time_str+86400000;
        //return time_str.substr(0, 10);
    }
}
]);
