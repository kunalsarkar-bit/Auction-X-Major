const mongoose = require('mongoose');

const DbCon = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB is connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = DbCon;
