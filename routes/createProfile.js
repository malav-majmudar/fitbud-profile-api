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

	let currentDate = `${year}-${pad(month)}-${pad(day)}`;
	currentDate = new Date(currentDate);
	console.log(currentDate);

	//filling the new user with the body of the request
	let user = new User({
		_id: req.body.userId,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		profilePicture: req.body.profilePicture,
		birthdate: new Date(req.body.birthdate),
		sex: req.body.sex.toLowerCase(),
		heightCm: req.body.heightCm,
		startingPercentBodyFat: {
			value: req.body.startingPercentBodyFat,
			date: currentDate,
		},
		startingWeightKg: {
			value: req.body.startingWeightKg,
			date: currentDate,
		},

		currentWeightKg: {
			value: req.body.startingWeightKg,
			date: currentDate,
		},
		currentPercentBodyFat: {
			value: req.body.startingPercentBodyFat,
			date: currentDate,
		},
		goals: req.body.goals,
		preferences: {
			Location: req.body.preferences.Location,
			unitPreference: req.body.preferences.unitPreference,
			mealNames: req.body.preferences.mealNames,
		},
	});

	//try catch relating to creating a new user object
	try {
		const newuser = await user.save();
		res.status(201).json({ message: "Account Created!" });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

//helper function to apply pad onto date
function pad(number) {
	if (String(number).length < 2) {
		return "0" + number;
	} else {
		return number;
	}
}
module.exports = router;
