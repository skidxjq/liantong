'use strict';
app.controller('disturbAnalyzeController', ['$scope',  '$http','$localStorage', 'toaster','$timeout', '$animate','$stateParams', function ($scope, $http,$alerts,toaster, $timeout, $stateParams,$animate) {
    $scope.timeStampMap={};
    $scope.legend=[];
    $scope.data={           //用于保存数据
        "districtMapData":[],    //地图数据 [{"value":&&,"name":%%%},...]
        "timeLineData":[]  ,     //通化趋势图数据
        "periodBarData":[] ,    //通话时段分布
        "hourData":[]     ,      //通话时段分布（小时）暂时无用
        "serviceProviderData":[]    //运营商
    };
    $scope.dataMap={        //用于保存横坐标的时间信息
        "dataHourMap":[],
        "periodBarMap":[],
        "timeLineMap":[]
    };
    //抬头部分
    $scope.info={
        "disturbRecoCount":0,
        "disturbCallingCount":0,
        "disturbTotalTime":0
    };
    $scope.echarts={
        "options":{
            "districtMapOption":{},
            "districtPieOption":{},
            "timeLineOption":{},
            "timeLineHourOption":{},
            "periodBarOption":{},
            "echarts.options.serviceProviderOption":{}

        },
        "api":{
            "districtMapApi":"",
            "distrcitPieApi":"",
            "timeLineApi":"",
            "timeLineHourApi":"",
            "periodBarApi":"",
            "serviceProviderApi":""
        }

    };
    $scope.echarts.api.districtMapApi="";
    $scope.$chartCityApi="";
    $scope.echarts.options.serviceProviderOptionApi="";
    $scope.isTimeRange=false;
    /*
     * 这里设置考虑到时间戳，如果有时间范围选择查询
     * */
    $scope.timeRangeStr=$scope.isTimeRange==true?'"{range":{"timestamp":{"from":'+$scope.minDate+',"to":'+$scope.maxDate+'}}}':[];
    $scope.timeRangeArr={"today":1,"yesterday":2,"lastweek":7,"lastmonth":30};

    $scope.getDisturbCallingCount=function(){
        $http.post($scope.requestUrl,{"facets":{"stats":{"statistical":{"field":"elapsedTime"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.role:\"1\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"stats_ring-log.role:\"1\"":{"statistical":{"field":"elapsedTime"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.role:\"1\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            $scope.info.disturbCallingCount=$countJson.facets.stats.count;
            $scope.info.disturbTotalTime=$countJson.facets.stats.total;
        })
    };
    //骚扰号码通话次数
    $scope.getDisturbRecoCount=function(){
        $http.post($scope.requestUrl,{"facets":{"stats":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-stat.role:\"1\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}},"stats_ring-stat.role:\"1\"":{"statistical":{"field":"role"},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-stat.role:\"1\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            $scope.info.disturbRecoCount=$countJson.facets.stats.count;
        })
    };

    //地区分布饼图
    /*
    * @params province type
    * if province == null 初始化饼图显示省份统计
    * */
    $scope.getDistrictPie=function($province,$type){
        var $provinceStr="";
        if($province!=null){
            $provinceStr="AND  ring-log.callingLoc.province:"+$province;
        }

        $type==null?$type="province":"city";
        $http.post($scope.requestUrl,{"facets":{"terms":{"terms":{"field":"callingLoc."+$type,"size":10,"order":"count","exclude":[]},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.role:\"1\""+$provinceStr}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var $districtSet=$countJson.facets.terms.terms;
            $scope.districtPieDataLegend=[];
            //$scope.districtPieData.push();

            $scope.setArrayEmpty($scope.legend);
            //$scope.legend.splice(0,$scope.legend.length);//清空数组重新绘制
            $scope.data.districtMapData.splice(0,$scope.data.districtMapData.length);//清空数组重新绘制

            for(var $i=0;$i<$districtSet.length;$i++){
                $scope.data.districtMapData.push({value:$districtSet[$i].count,name:$districtSet[$i].term});
                $scope.legend.push($districtSet[$i].term);
            }
            console.log($scope.data.districtMapData);
            console.log($scope.echarts.options.districtPieOption);
            if($districtSet.length==0){
                console.log("abcdd");
                $scope.echarts.api.districtPieApi.showLoading("暂无该省份数据");

            }else {
                $scope.echarts.options.districtPieOption.version++;     //重新绘制右侧饼图
            }
            if($province==null) {       //如果点击省份，则左侧的地图不需要重新绘制
                $scope.echarts.options.districtMapOption.series[0].data = $scope.data.districtMapData;
                $scope.echarts.options.districtMapOption.version++;
            }

        })
    };
    $scope.echarts.options.districtMapOption = {
        version: 1,
        title : {
            text: '',
            x:'left',
            show:false
        },
        tooltip : {
            trigger: 'item'
        },
        legend: {
            show:false,
            orient: 'vertical',
            x:'right',
            data:['号码归属地']
        },
        dataRange: {
            show:true,
            min: 0,
            max: 20000,
            x: 'left',
            y: 'bottom',
            text:['高','低']           // 文本，默认为数值文本
        },
        series : [
            {

                name: '号码归属地',
                type: 'map',
                mapType: 'china',
                roam: false,
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                },
                show:false,
                data:[]
            }
        ],
        onRegisterApi: function (chartApi) {
            $scope.echarts.api.districtMapApi = chartApi;
            $scope.echarts.api.districtMapApi.showLoading("正在加载中");
            console.log($scope.echarts.api.districtMapApi.registerMapSelected($scope));
        }
    }
    /*
     * 点击地图某省份切换饼图数据
     * */
    $scope.changeDistrictPie=function(params){
        $scope.echarts.api.districtPieApi.showLoading("正在加载中");

        console.log(params);

        $scope.getDistrictPie(params.name,"city");   //传递参数为省份名称和类别
        $scope.getProvider(params.name,"city");   //传递参数为省份名称和类别
    }

    $scope.getMapData=function(){
        $scope.echarts.options.districtMapOption.series.data=$scope.data.districtMapData;
        $scope.echarts.options.districtMapOption.version++;

    }
    //$districtMapApi.refresh();
    //$scope.pieChage++;


    /*
    *
    * 通话次数趋势图
    * 折线图
    * */
    $scope.getTimeLine=function(){
        $scope.echarts.api.timeLineApi?$scope.echarts.api.timeLineApi.showLoading("正在加载中"):"";
        $http.post($scope.requestUrl,{"facets":{"0_1":{"date_histogram":{"field":"timestamp","interval":"1d"},"global":true,"facet_filter":{"fquery":{"query":{"filtered":{"query":{"query_string":{"query":"ring-log.role:\"1\""}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var timeLineJsonOne=$countJson.facets["0_1"].entries;
            $scope.data.timeLineData.splice(0,$scope.data.timeLineData.length);//清空数组重新绘制
            $scope.dataMap.timeLineMap.splice(0,$scope.dataMap.timeLineMap.length);//清空数组重新绘制

            for(var $i=0;$i<timeLineJsonOne.length;$i++){
                //$scope.data.timeLineData.push([timeLineJsonOne[$i].time,timeLineJsonOne[$i].count]);
                $scope.data.timeLineData.push(timeLineJsonOne[$i].count);
                $scope.dataMap.timeLineMap.push($scope.timeStampToDate(timeLineJsonOne[$i].time));
                //$scope.dataMap.timeLineMap.push([timeLineJsonOne[$i].time,$scope.timeStampToDate(timeLineJsonOne[$i].time)]);
                //$scope.timeLineData.push([$scope.timeStampToDate(timeLineJson[$i].time),timeLineJson[$i].count]);
            }
            if(timeLineJsonOne.length!=0){
                $scope.echarts.options.timeLineOption.xAxis[0].data= $scope.dataMap.timeLineMap;
                $scope.echarts.options.timeLineOption.version++;
            }else{
                $scope.echarts.api.timeLineApi.showLoading("暂无相关数据");

            }


            //$scope.timeLineCount=timeLineJson;
        })

    }
    /*
     * 获得通话次数小时图
     * 暂时无用
     * */
    $scope.getTimeLineHour=function(){
        $scope.echarts.api.timeLineHourApi?$scope.echarts.api.timeLineHourApi.showLoading("正在加载中"):"";
        $http.post($scope.requestUrl,{"facets":{"0_2":{"date_histogram":{"field":"timestamp","interval":"1h"},"global":true,"facet_filter":{"fquery":{"query":{"filtered":{"query":{"query_string":{"query":"ring-log.role:\"1\""}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var timeLineJsonOne=$countJson.facets["0_2"].entries;
            $scope.data.hourData.splice(0,$scope.data.hourData.length);//清空数组重新绘制
            $scope.dataMap.dataHourMap.splice(0,$scope.dataMap.dataHourMap.length);//清空数组重新绘制

            for(var $i=0;$i<timeLineJsonOne.length;$i++){
                //$scope.data.timeLineData.push([timeLineJsonOne[$i].time,timeLineJsonOne[$i].count]);
                $scope.data.hourData.push(timeLineJsonOne[$i].count);
                $scope.dataMap.dataHourMap.push($scope.timeStampToDate(timeLineJsonOne[$i].time));
                //$scope.dataMap.timeLineMap.push([timeLineJsonOne[$i].time,$scope.timeStampToDate(timeLineJsonOne[$i].time)]);
                //$scope.timeLineData.push([$scope.timeStampToDate(timeLineJson[$i].time),timeLineJson[$i].count]);
            }
            if(timeLineJsonOne.length!=0){
                $scope.echarts.options.timeLineHourOption.xAxis[0].data= $scope.dataMap.dataHourMap;
                $scope.echarts.options.timeLineHourOption.version++;
            }else{
                //$scope.echarts.api.timeLineHourApi.showLoading("暂无相关数据");

            }
            //$scope.timeLineCount=timeLineJson;
        })
    }
    /*
     * 柱形图
     * */
    $scope.getPeriodBars=function(){
        $scope.echarts.api.periodBarApi?$scope.echarts.api.periodBarApi.showLoading("正在加载中"):console.log("ddddd");
        $http.post($scope.requestUrl,{"facets":{"terms":{"terms":{"field":"callPeriod","size":24,"order":"term","exclude":[]},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.role:\"1\""}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var timeLineJsonOne=$countJson.facets.terms.terms;
            $scope.data.periodBarData.splice(0,$scope.data.periodBarData.length);//清空数组重新绘制
            $scope.dataMap.periodBarMap.splice(0,$scope.dataMap.periodBarMap.length);//清空数组重新绘制

            for(var $i=0;$i<timeLineJsonOne.length;$i++){
                $scope.data.periodBarData.push(timeLineJsonOne[$i].count);
                $scope.dataMap.periodBarMap.push(timeLineJsonOne[$i].term);
                //$scope.data.periodBarData.push([timeLineJsonOne[$i].term,timeLineJsonOne[$i].count]);
                //$scope.data.periodBarData.push([timeLineJsonOne[$i].term,timeLineJsonOne[$i].count]);
                //$scope.dataMap.timeLineMap.push([timeLineJsonOne[$i].time,$scope.timeStampToDate(timeLineJsonOne[$i].time)]);
                //$scope.timeLineData.push([$scope.timeStampToDate(timeLineJson[$i].time),timeLineJson[$i].count]);
            }
            if(timeLineJsonOne.length!=0){
                $scope.echarts.options.periodBarOption.xAxis[0].data= $scope.dataMap.periodBarMap;
                $scope.echarts.options.periodBarOption.version++;
            }else{
                $scope.echarts.api.periodBarApi.showLoading("暂无相关数据");
            }
        })

    };


    $scope.timeStampToDate=function (nS) {
        var newDate=new Date(parseInt(nS)).toLocaleString();
        //这里构建json对象，为了后期点击响应时间提供数据。
        $scope.timeStampMap[newDate]=nS;
        return newDate;
    };
    $scope.getProvider=function($province){
        var $provinceStr="";
        if($province!=null){
            $provinceStr="AND  ring-log.callingLoc.province:"+$province;
        }
        $scope.echarts.options.serviceProviderOptionApi?$scope.echarts.options.serviceProviderOptionApi.showLoading("正在加载中"):console.log("fff");

        $http.post($scope.requestUrl,{"facets":{"terms":{"terms":{"field":"callingLoc.sp","size":10,"order":"count","exclude":[]},"facet_filter":{"fquery":{"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-log.role:\"1\""+$provinceStr}}]}},"filter":{"bool":{"must":$scope.timeRangeStr}}}}}}}},"size":0}).success(function(response){
            var $countJson=eval(response);
            var serviceProviderSet=$countJson.facets.terms.terms;
            $scope.setArrayEmpty($scope.data.serviceProviderData);


            for(var $i=0;$i<serviceProviderSet.length;$i++){
                $scope.data.serviceProviderData.push({value:serviceProviderSet[$i].count,name:"中国"+serviceProviderSet[$i].term});
            }
            $scope.echarts.options.serviceProviderOption.version++;
            //console.log($scope.pieDataTwoOption);
        })

    }
    /*
     * 绘制所有
     * */
    $scope.repaint=function(){
        $scope.getDisturbCallingCount();
        $scope.getDisturbRecoCount();
        $scope.getDistrictPie();
        $scope.getTimeLine();
        $scope.getPeriodBars();
        $scope.getTimeLineHour();
        $scope.getProvider();
    };
    $scope.repaint();






    //号码地区分布饼图
    $scope.echarts.options.districtPieOption = {
        version: 1,
        tooltip : {
            show:true,
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient:'vertical',
            itemGap:15,
            data: $scope.legend,
            y: 'bottom',
            x:'right'
        },
        toolbox: {
            show: false
        },

        padding: 0,
        calculable: true,

        series: [

            {
                name: '号码地区分布',
                type: 'pie',
                smooth: true,
                radius:'90%',
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
                center:['40%','50%'],
                data: $scope.data.districtMapData
                //这里兼顾右侧legend放不下，只选取最多15个
                //    [
                //    {value:335,name:'3G网络流量(GB)'},
                //    {value:333,name:'3G网络上周流量均值(GB)'},
                //    {value:0,name:'4G'},
                //    {value:0,name:'5G'}
                //]
            }
        ],
        onRegisterApi: function (chartApi) {
            $scope.echarts.api.districtPieApi=chartApi;
            $scope.echarts.api.districtPieApi.showLoading("正在加载中");
        }
    };
    //通话次数趋势折线图
    $scope.echarts.options.timeLineOption = {
        version: 1,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['通话次数'],
            y: 'bottom'
        },
        toolbox: {
            show: false
        },
        grid: {
            x: 50,
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

                //data: $scope.dataMap.timeLineMapToDate
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
                type: 'line',
                smooth: true,
                data: $scope.data.timeLineData
            }
        ],
        onRegisterApi: function (api) {

            $scope.echarts.api.timeLineApi = api;
            $scope.echarts.api.timeLineApi.registerTimeLineSelected($scope);


        }
    };

    //通话次数趋势小时
    $scope.echarts.options.timeLineHourOption = {
        version: 1,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['通话次数-小时'],
            y: 'bottom'
        },
        toolbox: {
            show: false
        },
        grid: {
            x: 50,
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

                //data: $scope.dataMap.timeLineMapToDate
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
                name: '通话次数-小时',
                type: 'line',
                symbol:'emptyCircle',
                smooth: true,
                itemStyle: {                // 系列级个性化
                    normal: {
                        color: 'green',
                        lineStyle:{
                            width:3,
                            shadowBlur:10

                        }
                    }
                },
                data: $scope.data.hourData
            }
        ],
        onRegisterApi: function (api) {

            $scope.echarts.api.timeLineHourApi = api;

        }
    };
    /*
     * echarts点击事件
     * 点击通话次数趋势图，则对应显示通话次数小时趋势图
     * */
    $scope.changeTimeLineHour=function(params){
        var $timeStampClicked=$scope.timeStampMap[params.name];
        console.log($timeStampClicked);
        $scope.setMinAndMaxDateByTimeStamp($timeStampClicked);
        console.log($scope.minDate);
        $scope.timeRangeStr = {
            "range": {
                "timestamp": {
                    "from": $scope.minDate,
                    "to": $scope.maxDate
                }
            }
        };
        $scope.getPeriodBars();
        $scope.getTimeLineHour();

        //console.log(params.name);
        //$scope.minDate = Date.parse($scope.dt_min);

    };


    /*
     * 根据传入的时间，比如2015-10-10 上午08:00:00 这种对应的时间戳
     * 获取对应到2015-10-10 00:00:00 到2015-10-10 23:59:59的时间戳范围
     * 并赋值给minDate 和 maxDate
     *
     * */
    $scope.setMinAndMaxDateByTimeStamp=function($timeStamp){
        $scope.minDate=Number($timeStamp-8*3600000);
        $scope.maxDate=Number($timeStamp+16*3600000);

    };
    //通话柱状图
    $scope.echarts.options.periodBarOption = {
        version: 1,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['通话时段分布'],
            y: 'bottom'
        },
        toolbox: {
            show: false
        },
        grid: {
            x: 50,
            y: 10,
            x2: 10,
            y2: 55
        },
        //grid: {
        //    x: 30,
        //    y: 10,
        //    x2: 10,
        //    y2: 55
        //},
        padding: 0,
        calculable: true,
        xAxis: [
            {
                axisLabel: {
                    interval: 0
                },
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
                type: 'bar',
                itemStyle: {                // 系列级个性化
                    normal: {
                        color: 'blue'
                    }

                },
                data: $scope.data.periodBarData
            }
        ],
        onRegisterApi: function (chartApi) {

            $scope.echarts.api.periodBarApi = chartApi;

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
        $scope.pop();//弹出toaster
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

    // 运营商分布图
    $scope.echarts.options.serviceProviderOption = {
        version: 1,
        tooltip : {
            show:true,
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient:'vertical',
            itemGap:15,
            data: ["中国联通","中国移动","中国电信"],
            y: 'bottom',
            x:'right'
        },
        toolbox: {
            show: false
        },
        padding: 0,
        calculable: true,
        series: [
            {
                name: '运营商分布',
                type: 'pie',
                smooth: true,
                radius:'90%',
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
                center:['40%','50%'],
                data:
                    $scope.data.serviceProviderData
                //    [
                //    {value:10,name:'中国联通',itemStyle: {                // 系列级个性化
                //        normal: {
                //            color: 'lawngreen'
                //        }
                //
                //    }},
                //    {value:0,name:'中国移动'},
                //    {value:0,name:'中国电信'}
                //]
            }
        ],
        onRegisterApi: function (chartApi) {
            $scope.echarts.options.serviceProviderOptionApi=chartApi;
            $scope.echarts.options.serviceProviderOptionApi.showLoading("正在加载中");
        }
    };


    /*Toaster*/

    $scope.toaster = {
        type: 'info',
        title: '当前选择日期范围',
        timeout:5000
        //text: $scope.minDate+"到"+$scope.maxDate
    };
    $scope.pop = function(){
        console.log($scope.maxDate);
        //toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
        toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.timeStampToDate($scope.minDate)+"到"+$scope.timeStampToDate($scope.maxDate),$scope.toaster.timeout);
    };
}
]);
