/**
 * Created by mac on 15-8-7.
 */
var mongoose = require( 'mongoose' );
var userlist = mongoose.model( 'ring_stat' );
var config   = require('../config');

//根据page，获取用户列表
exports.getUserListByPage=function(req,res,next){
    var page=req.params.page;
    userlist.find({"role":0}).
        skip(page*config.pageLimit).
        limit(config.pageLimit).
        exec(function(err,docs){
            //mydocs=docs;
            //console.log(mydocs);
            console.log(docs);
            res.send(docs);
        })
};

//获取总条数
exports.getUsersSum=function(req,res,next){
    userlist.count({"role":0},function(err,docs){
        console.dir(docs);
        var num=parseInt(docs);
        res.send({"total":num});
    })
}


//插入模拟数据
exports.insertMock=function(req,res,next){
    var data_json={
        "_class" : "cn.com.cetc.antifraud.object.RingStat",
        "number" : "0012088501581",
        "callingCount" :  Math.random()*10,
        "calledCount" :  Math.random()*10,
        "totalElapsed" :  Math.random()*2000,
        "onlineTime" :  Math.random()*10,
        "calledNumber" :  Math.random()*10,
        "isConflict" : Math.random()*10,
        "role" : 0,
        "avgElapsed" : Math.random()*100,
        "inoutRatio" : 0,
        "repeatRatio" : Math.random(),
        "onlineRatio" : 0,
        "avgCallingPerHour" : 0,
        "timestamp" :  1436708060476,
        "relationship" : [
            "0012088597923"
        ]
    };
    var data_arr=[];
    for(var i=0;i<200;i++){
        data_arr.push(data_json);
    }

    userlist.create(data_arr,function(err){
        //console.log(data_json);
    })
}