/**
 * Created by mac on 15-8-7.
 */
var elasticsearch = require('elasticsearch');
//var client = new elasticsearch.Client({
//    host: config.es.url
//    // log: 'trace'
//});

var config={
    pageLimit : 50,
    //hostUrl:"172.16.12.206",
    hostUrl : "localhost",
    port : 27017,
    sets : "unicom",
    legend : ['正常','骚扰电话','黑卡','高吸费电话'],
    es : {
        client:new elasticsearch.Client({
            host: "172.16.12.204:9200"
            // log: 'trace'
        }),
        url : "172.16.12.204:9200",
        index : 'anti-2015.06.03',
        type : 'ring-log'
    },
    roleType : ['正常','骚扰电话','黑卡','高吸费电话']


};

module.exports = config;
