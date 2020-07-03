const sgMail = require('@sendgrid/mail');

const config = require('../../config/config.json');
const defaultConfig = config.production;

const sendGridApiKey = defaultConfig.api_key;

sgMail.setApiKey(sendGridApiKey);


module.exports = function(message){
    
    sgMail.send(message)
}
