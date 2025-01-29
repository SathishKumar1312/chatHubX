const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connected successfully!');
    } catch(e){
        console.error('Not connected to database:', e);
    }
}

module.exports = connectToDB;