var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
var config   = require('./config');


var user = new Schema({
    //number    : Number,
    //content    : String,
    //level: String,
    //callingCount:Number,
    //calledCount:Number,
    //averageTime:Number,
    //location:{
    //    province:String,
    //    city:String
    //}
    "_class"    :   String,
    "number"    :   String,
    "callingCount"  :   Number,
    "calledCount"   :   Number,
    "totalElapsed"  :   Number,
    "onlineTime"    :   Number,
    "calledNumber"  :   Number,
    "isConflict"    :   Number,
    "role"          :   Number,
    "avgElapsed"    :   Number,
    "inoutRatio"    :   Number,
    "repeatRatio"   :   Number,
    "onlineRatio"   :   Number,
    "avgCallingPerHour" :  Number,
    "timestamp"     :   Number,
    "relationship"  :   Array
    //
    //"_class" : "cn.com.cetc.antifraud.object.RingStat",
    //"number" : "0012088501581",
    //"callingCount" :  3,
    //"calledCount" :  0,
    //"totalElapsed" :  2832,
    //"onlineTime" :  0,
    //"calledNumber" :  1,
    //"isConflict" : 0,
    //"role" : 0,
    //"avgElapsed" : 944,
    //"inoutRatio" : 0,
    //"repeatRatio" : 0.3333333432674408,
    //"onlineRatio" : 0,
    //"avgCallingPerHour" : 0,
    //"timestamp" :  1436708060476,
    //"relationship" : [
    //    "0012088597923"
    //]
});

mongoose.model( 'ring_stat', user );
var hostUrl = 'mongodb://' + config.hostUrl + ':' + config.port + '/' + config.sets;
console.log(hostUrl);
mongoose.connect( hostUrl);
//mongoose.connect('mongodb://172.16.12.206:27017/unicom');

