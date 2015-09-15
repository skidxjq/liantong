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
 var bodyParser = require('body-parser');
 var session = require('express-session');
 var cookieParser = require('cookie-parser');
 var routes ={
    overview :   require( './routes/overview' ),
    disturb :    require('./routes/disturb'),
    users :   require('./routes/users'),
    admin : require('./routes/admin')
};

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

var a=10;
/*
 *设置跨域访问
 */
 app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//user list
app.get('/users/getUserList/:page' , routes.users.getUserListByPage);
app.get('/users/getUsersSum' , routes.users.getUsersSum);
app.get('/users/insertMock' , routes.users.insertMock);

//overview page
app.get('/overview/getOverviewInfo' , routes.overview.getOverviewInfo);
app.get('/overview/pieData' , routes.overview.getPieData);

//admin 
app.post('/admin/signup', routes.admin.isUserExists, routes.admin.signup);
app.post('/admin/checkLogin', routes.admin.findUser);
app.post('/admin/add', routes.admin.isUserExists, routes.admin.signup);
app.get('/admin/list', routes.admin.getAdminList);
app.post('/admin/edit', routes.admin.edit);
app.post('/admin/del', routes.admin.del);


app.listen(8888, function () {
    console.log('app is listening at port 8888');
});
