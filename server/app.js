/**
 * Created by mac on 15-6-23.
 */
require("./db");
var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var http = require('http');
var qs = require('querystring');
var mongoose=require('mongoose');
var app = express();
var routes ={
    overview:   require( './routes/overview' ),
    disturb:    require('./routes/disturb'),
    users:   require('./routes/users')
};


/**
 *设置跨域访问
 */


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


app.get('/users/getUserList/:page',routes.users.getUserListByPage);
app.get('/users/getUsersSum',routes.users.getUsersSum);
app.get('/users/insertMock',routes.users.insertMock);
//app.get('/getlistByPage/:page',routes.overview.getUserListByPage);
//
//app.get('/getUserListCount',routes.overview.getUserListCount);
//
//app.get('/testPage',routes.overview.testPage);
//
//app.get('/testChat',function(req,res){
//    console.log(__dirname);
//    res.sendFile(__dirname+'/views/chat.html');
//
//})

app.listen(8888, function () {
    console.log('app is listening at port 8888');
});
