import mongoose from 'mongoose';
import Transaction from "./transaction";

// move to env file sometime
const DB_URL = 'mongodb+srv://chen:chen-dev@visa-hackathon-mzwpg.mongodb.net/FriendPay?retryWrites=true&w=majority'
const connectDb = () => {
    console.log("DB connection successful");
    return mongoose.connect(DB_URL);
};

const models = {Transaction};

export {connectDb};
export default models;
