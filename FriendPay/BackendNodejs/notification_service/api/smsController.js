'use strict';
var smsService = require("../service/smsService")
const bodyParser = require('body-parser')

const config = require('../../config/config.json');
const defaultConfig = config.production;
const SENDER_NAME = defaultConfig.sender_name;



var RequestMsg = {
    body: '',
    from: SENDER_NAME,
    to: ''
};
  
  

var smsControllers = {
    sendRequestSms: function(req, res) {
       var requestBody = req.body
       RequestMsg.to = requestBody.to;
       RequestMsg.body = "Hi," + requestBody.friend_name+ "! " +"Your friend " + requestBody.payee_name +" need your help. " + "Click " + requestBody.payment_link;
       try{
           smsService(RequestMsg);
           res.sendStatus(200);

       }catch(error){
           console.log(error);
           return next(error)
       }
   },
};

module.exports = smsControllers;
