/**
 * Created by mac on 15-9-1.
 */
/*
 Helper Functions
 */
 var mongoose = require( 'mongoose' );
 var Admin = mongoose.model('admin');
 var hash = require('./hash').hash;

var authenticate = exports.authenticate = function (name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    Admin.findOne({
            username: name
        },

        function (err, user) {
            if (user) {
                if (err) return fn(new Error('cannot find user'));
                hash(pass, user.salt, function (err, hash) {
                    if (err) return fn(err);
                    if (hash == user.hash) return fn(null, user);
                    fn(new Error('invalid password'));
                });
            } else {
                return fn(new Error('cannot find user'));
            }
        });

};


var requiredAuthentication = exports.requiredAuthentication =  function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
};

var userExist = exports.userExist = function (req, res, next) {
    Admin.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/signup");
        }
    });
};