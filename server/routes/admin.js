var mongoose = require( 'mongoose' );
var Admin = mongoose.model( 'admin' );
var hash = require('../utils/hash').hash;
var md5 = require('../utils/hash').md5;
var authenticate = require('../utils/admin').authenticate;
var config   = require('../config');
var moment = require('moment');
/*
 注册函数
 */
var signup = exports.signup = function (req, res){
    var password = req.body.password;
    var username = req.body.username;
    var email = req.body.email;
    //var level = req.body.level;
    var userRole = req.body.userRole;

    console.log(password);
    var admin = new Admin({
        username : username,
        password : md5(password),
        email : email,
        userRole : userRole,
        dateTime : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    });
    admin.save(function(err, newUser){
        if(err) throw err;
        res.send({"status":"ok"});
    });
    //hash(1234,12345);
    //hash(password, function (err, salt, hash) {
    //    if (err) throw err;
    //    var admin = new Admin({
    //        username: username,
    //        salt: salt,
    //        hash: hash
    //    }).save(function (err, newUser) {
    //        if (err) throw err;
    //        authenticate(newUser.username, password, function(err, user){
    //            if(user){
    //                req.session.regenerate(function(){
    //                    req.session.user = user;
    //                    req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
    //                    res.redirect('/');
    //                });
    //            }
    //        });
    //    });
    //});


};

/*
 * get admin list
 * */
exports.getAdminList = function(req, res, next) {
    Admin.find({}).
        exec(function(err,docs){
            if(err) throw err;
            //mydocs=docs;
            //console.log(mydocs);
            console.log(docs);
            res.send(docs);
        })
};

exports.isUserExists = function (req, res, next){
    console.log(req.body);
    Admin.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            //req.session.error = "User Exist";
            res.send({error:"user exists"});
        }
    });
    //console.log("5666");
};

exports.edit = function(req, res, next){
    var password = req.body.password;
    var username = req.body.username;
    var email = req.body.email;
    var userRole = req.body.userRole
    //var level = req.body.level;
    var _id = req.body._id;
    var newUser={
        username : username,
        password : md5(password),
        email : email,
        userRole : userRole,
        //level : level,
        dateTime : moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    };
    console.log("into ")
    Admin.update(
        {
            _id : _id
        },
        {
            $set:newUser
        },
        function(err, docs){
            if(err) throw err;
            res.json(docs);
        })
};

exports.del = function(req, res, next){
    var _id = req.body._id;
    Admin.remove({_id:_id}, function(err, docs) {
        res.send(docs);
    })
}



exports.findUser = function(req, res, next){
    var password = req.body.password;
    var username = req.body.username;
    Admin.findOne({
        username : username,
        password : md5(password)
    }, function(err, docs){
        if(err)  throw err;
        res.json(docs);

    });
}