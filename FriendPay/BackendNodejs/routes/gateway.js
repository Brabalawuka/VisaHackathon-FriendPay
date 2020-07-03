const express = require('express');
const { submitTransaction, updateTransaction, queryTransaction } = require('../gateway');
const router = express.Router();

router.post('/transaction', submitTransaction);
router.patch('/transaction', updateTransaction);
router.get('/transaction', queryTransaction);

module.exports = router;

