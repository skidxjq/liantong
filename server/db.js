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

});

var admin = new mongoose.Schema({
    username: String,
    password: String,
    email : String,
    level : Number,
    dateTime: Date
    //salt: String,
    //hash: String
});

mongoose.model( 'ring_stat', user );
mongoose.model( 'admin', admin );

var hostUrl = 'mongodb://' + config.hostUrl + ':' + config.port + '/' + config.sets;
console.log(hostUrl);
mongoose.connect( hostUrl);
//mongoose.connect('mongodb://172.16.12.206:27017/unicom');

