const express = require('express')
const router = express.Router()
const User = require("../models/profileSchema.js")
const mongoose = require('mongoose');

//retrieve user
router.get('/:userId', async (request,response) => {
    try {
        if (request.params.userId.length != 24) {
          response.status(400).json({ message: "Invalid ID Parameter" });
        } else {
          const user = await User.findById(request.params.userId);
          if (user === null) {
            response.status(404).json({ message: "User Not Found" });
          } else {
            response.status(200);
            response.send(user);
          }
        }
      } catch (e) {
        response.status(500).json({ message: "Internal Error" });
        console.log(e);
      }
})

//update user profile entries
router.patch('/:userId', async (req,response) => {
  try {
      if (req.params.userId.length != 24) {
        response.status(400).json({ message: "Invalid ID Parameter" });
      } 
      const updateUser = {
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
      };
      console.log(updateUser)

      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        updateUser
      );
      response.status(200).json(updatedUser);
      console.log(updatedUser);
    } catch (e) {
      response.status(500).json({ message: "Internal Error" });
      console.log(e);
    }
})

//delete user profile entries
router.delete("/:userId", async (request, response) => {
  console.log("got request: ", request.params.userId)
  try {
    if (request.params.userId.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      await User.deleteOne({
        _id: request.params.userId,
      });
      response.status(200).json({message: "Account deleted"})
    }
  } catch (e) {
    response.status(500).json({ message: "Internal Error" });
    console.log(e);
  }
});


//router.get('/:userId/analytics', async (request, response) => {









//})

module.exports = router