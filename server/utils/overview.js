/**
 * Created by mac on 15-8-10.
 */
var mongoose = require( 'mongoose' );
var elasticsearch = require('elasticsearch');
var eventproxy = require('eventproxy');
var overviewJson = require('../json').overviewJson;
var Config = require('../config');
var client = Config.es.client;
var userlist     = mongoose.model( 'ring_stat' );
var _ = require('lodash');



/*
 * 获取骚扰号码 | 黑卡  | 正常卡个数
 **/
var getCountByConditionWithPromise = exports.getCountByConditionWithPromise  =   function (condition){

    var promise= new mongoose.Promise();

    userlist.count(condition, function(err,docs){
        promise.resolve(err,docs);
    });
    return promise;
};

/*
 * with no promise
 * */


exports.getCountByConditionNoPromise    =   function(condition, callback){
    userlist.count(condition, callback);
}
/*
 * 获得总数
 * */
exports.getTotalCount = function(callback) {
    //var client = new elasticsearch.Client({
    //    host: Config.es.url
    //    // log: 'trace'
    //});

    client.search({
        index : Config.es.index,
        body : overviewJson.totalCountJson
        // type: 'ring-log',

    }).then(
        callback
        //console.log(resp);
    );
};
/*
 *获取通话次数占比
 * */
exports.getCallCountMakeUp = function(callback){
    client.search({
        index : Config.es.index,
        body : overviewJson.pieData.callCountMakeUpJson
    }).then(callback);
};
/*
 *获取通话时长占比
 * */
exports.getCallPeriodMakeUp = function(callback){
    client.search({
        index : Config.es.index,
        body : overviewJson.pieData.callPeriodMakeUpJson
    }).then(callback);
};

/*
 * 解刨json
 *
 * */

var breakJsonFromTotal = exports.breakJsonFromTotal   =   function(obj){
    console.log(obj);
    return obj["facets"]["terms"]["total"];
};


var breakJsonFromCallCountMakeUp = exports.breakJsonFromCallCountMakeUp   =   function(obj){
    console.log(obj["facets"]["terms"]["terms"]);
    return fixDataForPieOnCount(obj["facets"]["terms"]["terms"],Config.legend);
};

var breakJsonFromCallPeriodMakeUp = exports.breakJsonFromCallPeriodMakeUp   =   function(obj){
    console.log(obj["facets"]["terms"]["terms"]);
    return fixDataForPieOnTotal(obj["facets"]["terms"]["terms"]);
};

var breakJsonFromCallNumMakeUp = exports.breakJsonFromCallNumMakeUp   =   function(obj){

};


/**
 *
 * 修正json
 * @input [ { term: 0, count: 2083541 },
 *{ term: 1, count: 1961 },
 *{ term: 2, count: 38 } ]
 *
 * @output [{"name":黑卡,"value":123456}...{}]
 */
var fixDataForPieOnCount = exports.fixDataForPieOnCount = function(obj){
    var i = 0,
        length = obj.length,
        output = [];
    for(i=0;i<length;i++){
        output.push({value : obj[i].count, name : Config.roleType[obj[i].term]});
    }
    console.log(output);
    return output;

}


/**
 *
 * 修正json
 * @input [ { term: 0,total: 2083541 },
 *{ term: 1, total: 1961 },
 *{ term: 2, total: 38 } ]
 *
 * @output [{"name":黑卡,"value":123456}...{}]
 */
var fixDataForPieOnTotal = exports.fixDataForPieOnTotal = function(obj){
    var i = 0,
        length = obj.length,
        output = [];
    for(i=0;i<length;i++){
        output.push({value : obj[i].total, name : Config.roleType[obj[i].term]});
    }
    console.log(output);
    return output;

}