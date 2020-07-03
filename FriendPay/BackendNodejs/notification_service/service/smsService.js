
const config = require('../../config/config.json');
const defaultConfig = config.production;
const accountSid = defaultConfig.twilio_account_sid;
const authToken = defaultConfig.twilio_auth_token;

const client = require('twilio')(accountSid, authToken);

module.exports = function(message){

    console.log(message)
    client.messages.create(message)
    .then(messages => console.log(messages.sid));
}
