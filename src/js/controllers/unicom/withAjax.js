'use strict';
app.controller('WithAjaxCtrl', WithAjaxCtrl);

function WithAjaxCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    var fengxianMap={0:"正常",1:"骚扰",2:"高吸费",3:"黑卡"};
    //vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
    vm.dtOptions = DTOptionsBuilder.fromSource('http://172.16.12.206:9090/showUserList')
    //vm.dtOptions = DTOptionsBuilder.fromJson($jsonData)
    //vm.dtOptions = DTOptionsBuilder.fromSource('../php/userList.php')
    //vm.dtOptions = DTOptionsBuilder.fromSource($jsonData)
        .withDataProp('hits')
        .withPaginationType('full_numbers')
    //vm.dtOptions = DTOptionsBuilder.withSource("http://172.16.12.208:9200/anti-2015.04.09/_search?pretty").withDataProp('hits').withFnServerData(serverData)
    //    .withPaginationType('full_numbers');
    //function serverData(sSource, aoData, fnCallback, oSettings) {
    //    oSettings.jqXHR = $.ajax({
    //        'dataType': 'json',
    //        'type': 'POST',
    //        'url': sSource,
    //        //'data': {"query":{"filtered":{"query":{"bool":{"should":[{"query_string":{"query":"ring-stat.role:\"1\""}}]}},"filter":{"bool":{"must":[{"match_all":{}}]}}}},"highlight":{"fields":{},"fragment_size":2147483647,"pre_tags":["@start-highlight@"],"post_tags":["@end-highlight@"]},"size":500,"sort":[{"number":{"order":"desc","ignore_unmapped":true}}]},
    //        'data':aoData,
    //        'success': fnCallback
    //    });
    //}

    vm.dtColumns = [
        DTColumnBuilder.newColumn('_source.number').withTitle('电话号码').renderWith(function(data,type,full){
            return "<a ui-sref='app.userEvaluate({'telNumber':"+data+"}) href='#/app/userEvaluate/"+data+"''>"+data+"</a>";
        }),
        DTColumnBuilder.newColumn('_source.role').withTitle('风险类型'),
        DTColumnBuilder.newColumn('_source.callingCount').withTitle('主叫次数'),
        DTColumnBuilder.newColumn('_source.calledCount').withTitle('被叫次数'),
        DTColumnBuilder.newColumn('_source.avgElapsed').withTitle('平均通话时长'),

        DTColumnBuilder.newColumn('_source.location.province').renderWith(function(data,type,full){
            if(data==null){
                return "无";
            }else{
                return data;
            }
            //return full._source.location==""?data:"hehe";
        }).withTitle('省份') ,
        DTColumnBuilder.newColumn('_source.location.city').renderWith(function(data,type,full){
            if(data==null){
                return "无";
            }else{
                return data;
            }
            //return full._source.location==""?data:"hehe";
        }).withTitle('城市')
    ];
}
