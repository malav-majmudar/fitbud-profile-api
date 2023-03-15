require('dotenv').config()


const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
app.use(express.json())


mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })


const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.listen(8002, () => console.log('Server Started'))

const usersRouter = require('./routes/users')
const profileRouter = require('./routes/createProfile')

app.use('/users', usersRouter)     
app.use('/createProfile', profileRouter)    


