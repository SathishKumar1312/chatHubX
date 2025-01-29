const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectToDB = require('./db/connectDB');

const authRoute = require('./routes/authRoute');
const messageRoute = require('./routes/messageRoute');
const { app, server, io } = require('./utils/socket');
require('dotenv').config();

const port = process.env.PORT || 5001;

app.use(cors({origin:['https://chathubx.onrender.com', 'http://localhost:5173'], credentials: true}));

connectToDB();


app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Allow for rich objects and arrays
app.use(cookieParser());

app.use('/api/auth',authRoute);
app.use('/api/messages',messageRoute);

app.get('/',(req,res)=>{
	res.send('hello world!')
})

server.listen(port,()=>{
	console.log(`server is running on ${port}`)
});