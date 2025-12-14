const mongoose = require('mongoose');

function connectToDb() {
    return mongoose
        .connect(process.env.DB_CONNECT, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err.message);
            process.exit(1); // optional but recommended
        });
}

module.exports = connectToDb;
