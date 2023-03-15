const express = require('express')
const router = express.Router()
const User = require("../models/profileSchema.js")




router.post('/', async (req, res) =>  {
    //creating a new user under input arguments
    const user = new User({
        userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        profilePicture: req.body.profilePicture,
        birthdate: req.body.birthdate,
        sex: req.body.sex,
        heightCM: req.body.heightCM,
        startingWeightKg: req.body.startingWeightKg,
        currentWeightKg: req.body.currentWeightKg,
        percentBodyFat: req.body.percentBodyFat,
        goals: req.body.goals,
        preferences: req.body.preferences
    })

    //try catch relating to creating a new user object
    try{
        const newuser = await user.save()
        res.status(201).json({message: "Account Created!"})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
})

module.exports = router