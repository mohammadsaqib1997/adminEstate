var express = require('express');
var router = express.Router();
var twilio_config = require('./../config/app_config.json').twilio_config;
var body_valid_f = require("./../modules/body_validate");

var firebase_admin = require('firebase-admin');
var database = firebase_admin.database();
var users = database.ref('users');

var RestClient = require('twilio').RestClient;
var LookupsClient = require('twilio').LookupsClient;

var rest_client = new RestClient(twilio_config.accountSID, twilio_config.authToken);
var lookup_client = new LookupsClient(twilio_config.accountSID, twilio_config.authToken);

/* GET users listing. */
router.post('/check', function (req, res, next) {
    res.json({status: "ok", message: "valid request."});
});

router.post('/number_varify', function (req, res) {
    var validation = {
        "mob_no": ['required', 'number', 'trim', 'length=12']
    };
    var check = body_valid_f.valid_param(req.body, validation);

    if(!check.status){
        res.json({
            status: "failed",
            message: check.message
        });
    }else{
        var mob_no = req.body.mob_no;
        users.orderByChild("mob_no").equalTo(parseInt(mob_no)).once('value', function (snap) {
            var val = snap.val();
            if(val){
                res.json({
                    status: "failed",
                    message: "Already exit!"
                });
            }else{
                lookup_client.phoneNumbers("+"+mob_no).get(function(err, number){
                    if (err) {
                        res.json({"status": "failed", "message": err.message});
                    }else{
                        var code = Math.floor(Math.random() * 900000) + 100000;
                        rest_client.messages.create({
                            body: 'Your auth token is: "' + code,
                            to: "+" + mob_no,  // Text this number
                            from: twilio_config.phone_num
                        }, function (err, msg) {
                            if (err) {
                                res.json({"status": "failed", "message": err.message});
                            } else {
                                res.json({"status": "ok", "token": code});
                            }
                        });
                    }
                });
            }
        });
    }
});


router.use('*', function (req, res) {
    res.json({status: "failed", message: "Invalid request!"});
});

module.exports = router;
