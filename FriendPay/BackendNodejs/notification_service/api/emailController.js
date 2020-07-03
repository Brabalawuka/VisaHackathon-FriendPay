'use strict';
var emailService = require("../service/emailService")
const bodyParser = require('body-parser')

const config = require('../../config/config.json');
const defaultConfig = config.production;
const SENDER_ADDRESS = defaultConfig.sender_address;
const TEMPLATE_ID = defaultConfig.template_id;

var RequestMsg = {
    to: '',
    from: SENDER_ADDRESS,
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
        name: "Test",
        request_name :"Test",
        private_message: "Please help me pay",
        paymentlink: "www.google.com.sg",
        subject: 'VisaFriendPay - Your Friend is Requesting help from you',
      }
  };
  
  
  var confirmationMsg = {
      to: '',
      from: SENDER_ADDRESS,
      subject: 'VisaFriendPay - PaymentSuccess',
      html: '<strong>Thanks for using VisaFriendPay, your frined has successfully paid for you. You may go to your shopping website to check payment status</strong>',
    };

      
  var rejectMsg = {
    to: '',
    from: SENDER_ADDRESS,
    subject: 'VisaFriendPay - Payment Rejected',
    html: '<strong>Thanks for using VisaFriendPay, Unfortunately, your frined has rejected your payment. If your payments get rejected more than 5 times, your account will be invetigated under spamming. You may go to your shopping website to check payment status</strong>',
  };


    
  

var emailControllers = {
    sendRequestEmail: function(req, res) {
       var requestBody = req.body
       console.log(requestBody)
       RequestMsg.to = requestBody.to;
       RequestMsg.dynamic_template_data.name = requestBody.friend_name == null? "My Friend" : requestBody.friend_name;
       RequestMsg.dynamic_template_data.request_name = requestBody.payee_name  == null? "" : requestBody.payee_name;
       RequestMsg.dynamic_template_data.private_message = requestBody.private_message == null? "No Message": requestBody.private_message;
       RequestMsg.dynamic_template_data.paymentlink = requestBody.payment_link;
       try{
           emailService(RequestMsg);
           res.sendStatus(200);
       }catch(error){
           res.status(404);
           res.send({error: error});
           console.log(error);
           return next(error)
       }
       
   },
   sendConfirmEmail: function(req, res) {
            var requestBody = req.body
            console.log(requestBody);
            confirmationMsg.to = requestBody.to;
            try{
                emailService(confirmationMsg);
                res.sendStatus(200);
            }catch(error){
                console.log(error);
                return next(error)
            }
    },
    sendFailEmail: function(req, res) {
        var requestBody = req.body
        console.log(requestBody);
        rejectMsg.to = requestBody.to;
        try{
            emailService(rejectMsg);
            res.sendStatus(200);
        }catch(error){
            console.log(error);
            return next(error)
        }
   },
};

module.exports = emailControllers;
