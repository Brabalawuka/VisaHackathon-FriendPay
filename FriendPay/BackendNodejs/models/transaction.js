import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema(
    {
        //payment information
        currencyCode: {type: String, required: true},
        amount: {type: String, required: true},

        //keys
        checkoutKey: {type: String, required: true},
        encryptionKey: {type: String, required: true},

        //friendpay information
        customerName: String,
        customerEmail: String,
        customerMessage: String,
        friendEmail: String,
        friendPhone: String,
        friendName: String,
        transactionStatus: {type: String, default: 'Pending'},
        timeCreated: {type: Date, default: Date.now},

        //visa information
        visaCallId: {type: String, default: "null"},
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
