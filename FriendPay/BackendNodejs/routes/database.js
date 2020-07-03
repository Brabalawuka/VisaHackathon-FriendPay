const express = require('express');
const _ = require('lodash');
const router = express.Router();

import models from '../models';
const {Transaction} = models;

// Create new transaction document in db
router.post('/transaction', async function(req, res) {
    try {
        const transaction = new Transaction({
            //payment information
            currencyCode: req.body.currencyCode,
            amount: req.body.amount,

            //keys
            checkoutKey: req.body.checkoutKey,
            encryptionKey: req.body.encryptionKey,

            //friendpay information
            customerName: req.body.customerName,
            customerEmail: req.body.customerEmail,
            customerMessage: req.body.customerMessage,
            friendName: req.body.friendName,
            friendEmail: req.body.friendEmail,
            friendPhone: req.body.friendPhone,
        });
        await transaction.save()
        res.send(transaction)
    } catch(err) {
        res.status(404);
        res.json(err);
    }

});

// Retrieve the transaction that corresponds to a transaction _id field
router.get('/transaction', async function(req, res) {

    try {
        const transaction = await Transaction.findOne({_id: req.body.transactionId});
        const timeCreated = new Date(transaction.timeCreated);
        // console.log(timeCreated);
        // console.log(new Date(_.now()));
        // Expire in 1 hour
        if(timeCreated.getTime() < _.now() - 60 * 60 * 1000){
            transaction.transactionStatus = "Expired";
            transaction.checkoutKey = 'null';
            transaction.encryptionKey = 'null';
            await transaction.save();
        }
        res.send(transaction);
    } catch {
        res.status(404);
        res.send({error: "Transaction ID does not exist"});
    }
});

// Updates the transaction status (Pending, Success, Expired, Rejected)
router.patch('/transaction', async function(req, res) {
    const transactionId = req.body.transactionId;
    const transactionStatus = req.body.transactionStatus;
    const visaCallId = req.body.visaCallId;

    try {
        const transaction = await Transaction.findOne({_id: transactionId});
        // Only allow transaction to be updated if it is still pending.
        if (!(_.isEqual(transaction.transactionStatus, "Pending"))){
            res.status(404);
            res.send({error: "Transaction is no longer pending."});
            return;
        }

        // Check if transaction should be expired and clear secret keys if expired
        const timeCreated = new Date(transaction.timeCreated);
        // console.log(timeCreated);
        // console.log(new Date(_.now()));
        // Expire in 1 hour
        if(timeCreated.getTime() < _.now() - 60 * 60 * 1000){
            transaction.transactionStatus = "Expired";
            transaction.checkoutKey = 'null';
            transaction.encryptionKey = 'null';
            await transaction.save();
            res.status(404);
            res.send({error: "Transaction already expired."});
            return;
        }
        
        // Pending state can be changed to Success or Rejected
        if(transactionStatus && _.includes(["Success", "Rejected"], transactionStatus)){
            transaction.transactionStatus = transactionStatus;
            await transaction.save();
        } else {
            res.status(404);
            res.send({error: "Invalid Transaction status."});
            return;
        }
    
        if(visaCallId){
            transaction.visaCallId = visaCallId;
            await transaction.save();}
        
        res.status(200);
        res.send(transaction);

    } catch (error) {
        res.status(404);
        res.send({error: "Transaction ID does not exist"})
        console.log(error);
    }
});

// Returns all transactions in the collection
router.get('/transactions', async function(req, res) {
    const transactions = await Transaction.find();
    console.log(transactions);
    return res.send(transactions);
});

module.exports = router;
