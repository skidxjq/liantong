/**
 * Created by mac on 15-8-10.
 */
var mongoose = require( 'mongoose' );
var userlist     = mongoose.model( 'ring_stat' );



/*
 * 获取骚扰号码 | 黑卡  | 正常卡个数
 **/
exports.getCountByCondition  =   function (condition){

    var promise= new mongoose.Promise();

    userlist.count(condition, function(err,docs){
        promise.resolve(err,docs);
    });
    return promise;
};



/*
 * 获取饼状图数据
 *
 * */