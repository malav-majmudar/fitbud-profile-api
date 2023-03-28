const express = require("express");
const router = express.Router();
const User = require("../models/profileSchema.js");

router.post("/", async (req, res) => {
  //creating a new user under input arguments
  //creating the current date for account paramters
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${day}-${month}-${year}`;

  const user = new User({
    _id: req.body.userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    profilePicture: req.body.profilePicture,
    birthdate: new Date(req.body.birthdate),
    sex: req.body.sex,
    heightCM: req.body.heightCM,
    startingWeightKg: req.body.startingWeightKg,
    startingWeightDate: new Date(currentDate),
    currentWeightKg: req.body.currentWeightKg,
    percentBodyFat: req.body.percentBodyFat,
    goals: req.body.goals,
    preferences: req.body.preferences,
  });

  //try catch relating to creating a new user object
  try {
    const newuser = await user.save();
    res.status(201).json({ message: "Account Created!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
