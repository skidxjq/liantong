/**
 * Created by mac on 15-6-30.
 */
var mongoose = require( 'mongoose' );
var userlist     = mongoose.model( 'ring_stat' );
//var userlist     = mongoose.model( 'userlist' );
var count=5;



exports.getDisturbListByPage=function(req,res,next){
    var page=req.params.page;
    userlist.find({}).
        skip(page*count).
        limit(count).
        exec(function(err,docs){
            //mydocs=docs;
            //console.log(mydocs);
            console.log(docs);
            res.send(docs);
        })
};


exports.getUserListCount=function(req,res,next){
    //userlist.find({})
    //    .exec(function(err,docs){
    //        console.log(docs);
    //            //res.send(docs.length);
    //        });
    userlist.count({},function(err,docs){
        console.log(docs);
    })
};