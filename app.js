require('dotenv').config()


const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })


const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.listen(process.env.LISTEN_PORT, () => console.log('Server Started'))

app.use((req, res, next) => {
    console.log("~~~~~~~~~~~~~~~~~~~~");
    console.log("Got Request!");
    req.method ? console.log("Method:", req.method) : null;
    req.originalUrl ? console.log("Original URL:", req.originalUrl) : null;
    req.get("Authorization") ? console.log("Authorization:", req.get("Authorization")) : null;
    console.log("~~~~~~~~~~~~~~~~~~~~");
    next();
});


const usersRouter = require('./routes/users')
const profileRouter = require('./routes/createProfile')
const diaryRouter = require('./routes/diary')
const profilePictureRouter = require('./routes/profilePicture')


app.use('/users', usersRouter)     
app.use('/createProfile', profileRouter)    
app.use('/diary', diaryRouter)
app.use('/profilePicture', profilePictureRouter)
