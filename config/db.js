// Set up mongoose connection
const mongoose = require('mongoose');

// get database info from environment variables
dbName = process.env.DB_NAME
dbUser = process.env.DB_USER
dbPass = process.env.DB_PASS
dbUrl = process.env.DB_URL
// default mongodb 
let dbUrlDefault = 'mongodb://localhost:27017/db_meditationLive_test';
let mongoDB = dbUrl || dbUrlDefault;

var options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}

try {
    mongoose.connect(mongoDB, options);
    mongoose.Promise = global.Promise;
    let db = mongoose.connection;
} catch (error) {
    console.log(error)
}