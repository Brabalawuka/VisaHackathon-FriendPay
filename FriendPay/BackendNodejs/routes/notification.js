const express = require('express');
const router = express.Router();

import {sendRequestEmail, sendConfirmEmail, sendFailEmail} from '../notification_service/api/emailController';
import {sendRequestSms} from '../notification_service/api/smsController';

router.post('/send-request-email', sendRequestEmail);
router.post('/send-confirm-email', sendConfirmEmail);
router.post('/send-fail-email',  sendFailEmail);
router.post('/send-request-sms', sendRequestSms);

module.exports = router;

