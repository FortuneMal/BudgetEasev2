// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/budgetease', {
            // These options are deprecated in newer Mongoose versions but are commonly seen.
            // Mongoose 6+ handles them by default. You can often omit them.
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true, // Deprecated
            // useFindAndModify: false // Deprecated
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
