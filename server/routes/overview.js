/**
 * Created by mac on 15-6-30.
 */
var mongoose        =   require( 'mongoose' );
var userlist        =   mongoose.model( 'ring_stat' );
var overviewUtil    =   require('../utils/overview');
var Config          =   require('../config');
var eventproxy      =   require('eventproxy');

//获取五个info
exports.getOverviewInfo=function (req, res, next){
    console.log("come into getOverviewInfo");

    //var obj = setOverviewInfo(res);
    var ep = new eventproxy();
    ep.all('totalCount','callingCount', 'disturbCount', 'blackCardCount', 'cheatCount',
        function(totalCount, callingCount, disturbCount, blackCardCount, cheatCount){
            //console.log(callingCount);
            //console.log(disturbCount);
            //console.log(blackCardCount);
            //console.log(cheatCount);
            var obj=integrateJson(totalCount, callingCount, disturbCount, blackCardCount, cheatCount);
            res.json(obj)
        });

    //获取主叫次数
    overviewUtil.getCountByConditionNoPromise({"callingCount" : {$gt : 0}},function(err,docs){
        ep.emit('callingCount',docs);
    });

    //获取骚扰次数
    overviewUtil.getCountByConditionNoPromise({role:1},function(err,docs){
        ep.emit('disturbCount',docs);
    });

    //获取骚扰黑卡
    overviewUtil.getCountByConditionNoPromise({role:2},function(err,docs){
        ep.emit('blackCardCount',docs);
    });

    //获取高吸费
    overviewUtil.getCountByConditionNoPromise({role:3},function(err,docs){
        ep.emit('cheatCount',docs);
    });

    //获取总通话次数
    overviewUtil.getTotalCount(function(resp){
        ep.emit('totalCount',overviewUtil.breakJsonFromTotal(resp));
    });

    //console.log(obj);
    //res.send(obj);

};

/*
 * 获取饼图数据
 * */

exports.getPieData = function(req, res, next){
    console.log("into the get PieData");

    //use eventproxy
    var ep = new eventproxy();

    /*
     * callCountMakeUp  通话次数占比
     *
     * callPeriodMakeUp 通话时长占比
     * */
    ep.all('callCountMakeUp', 'callPeriodMakeUp', function(callCountMakeUp, callPeriodMakeUp){
        res.json(
            {
                pieDataOne : callCountMakeUp,

                pieDataThree : callPeriodMakeUp
            })

    });


    //pieOne
    overviewUtil.getCallCountMakeUp(function(resp){
        ep.emit('callCountMakeUp', overviewUtil.breakJsonFromCallCountMakeUp(resp));
    });



    //pieThree
    overviewUtil.getCallPeriodMakeUp(function(resp){
        ep.emit('callPeriodMakeUp',overviewUtil.breakJsonFromCallPeriodMakeUp(resp))
    });

};





/*
 * 组合成json obj
 * 用于overview.info
 * */
function integrateJson(totalCount,callingCount, disturbCount, blackCardCount, cheatCount){
    return{
        "info":
        {
            "totalCount" : totalCount,
            "callingCount" : callingCount,
            "disturbCount" : disturbCount,
            "blackCardCount" : blackCardCount,
            "cheatCount" : cheatCount
        },
        "pieDataTwo":[
            {
                value : callingCount,
                name : Config.legend[0]
            },
            {
                value : disturbCount,
                name : Config.legend[1]
            },
            {
                value : blackCardCount,
                name : Config.legend[2]
            },
            {
                value : cheatCount,
                name : Config.legend[3]
            },
        ]

    }
}