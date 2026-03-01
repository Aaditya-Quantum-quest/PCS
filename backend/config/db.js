const mongoose = require('mongoose');

const URI = process.env.MONGOURI;

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("THE DATABASE CONNECTION IS OK")
    } catch (error) {
        console.log("THE ERROR IS AT CONNECTDB FILE");
        process.exit(1);
    }
}

module.exports = connectDB;