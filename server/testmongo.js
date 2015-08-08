/**
 * Created by mac on 15-6-29.
 */

var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var http = require('http');
var qs = require('querystring');
var mongoose=require('mongoose');
var app = express();
var mongoose = require('mongoose');



mongoose.connect('mongodb://localhost/test');
db = mongoose.connection;
db.once('open', function callback () {
    // yay!
});
var kittySchema = mongoose.Schema({
    name: String
});
var Kitten = mongoose.model('kitten', kittySchema);
var silence = new Kitten({ name: "Silence"});
silence.save(function(err){

});