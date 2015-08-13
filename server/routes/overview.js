/**
 * Created by mac on 15-6-30.
 */
var mongoose        =   require( 'mongoose' );
var userlist        =   mongoose.model( 'ring_stat' );
var overviewUtil    =   require('../utils/overview');
var config          =   require('../config');


//获取五个info
exports.getOverviewInfo=function (req, res, next){

    var obj = setOverviewInfo(res);
    console.log(obj);
    //res.send(obj);

};

exports.getPieData = function (req, res, next){


};

function setOverviewInfo(res){
    var obj={},pieObj=[];

    //主叫号码个数
    overviewUtil.getCountByCondition({"callingCount" : {$gt : 0}}).then(
        function (result){
            console.log(typeof result);
            console.log(result);
            obj["callingCount"] = parseInt (result);
            pieObj.push({name:config.legend[0],value:obj["callingCount"]});
        } ,
        function (err){

        }
    ).then(

    //骚扰号码个数
    overviewUtil.getCountByCondition({role:1}).then(
        function (result){
            console.log (result);
            obj["disturbCount"] = parseInt (result);
            pieObj.push({name:config.legend[1],value:obj["disturbCount"]});

        } ,
        function(err){

        }
    )).then(

    //黑卡识别个数
    overviewUtil.getCountByCondition({role:2}).then(
        function (result){
            console.log (result);
            obj["blackCardCount"] = parseInt (result);
            pieObj.push({name:config.legend[2],value:obj["blackCardCount"]});

        } ,
        function(err){

        }
    )).then(

    //骚扰电话识别个数
    overviewUtil.getCountByCondition({role:3}).then(
        function (result){
            console.log (result);
            obj["cheatCount"] = parseInt (result);
            pieObj.push({name:config.legend[3],value:obj["cheatCount"]});
            res.json({"overviewInfo":obj,"pieDataTwo":pieObj});
        } ,
        function(err){

        }
    ));
};



