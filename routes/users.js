const express = require("express");
const router = express.Router();
const User = require("../models/profileSchema.js");
const Diary = require("../models/diarySchema.js")

//retrieve user
router.get("/:userId", async (request, response) => {
	try {
		if (request.params.userId.length != 24) {
			response.status(400).json({ message: "Invalid ID Parameter" });
		} else {
			const user = await User.findById(request.params.userId);
			if (!user) {
				return response.status(404).json({ message: "User Not Found" });
			} else {
				response.status(200);
				response.send(user);
			}
		}
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
});

//update user profile entries
router.patch("/:userId", async (req, response) => {
	try {
		if (req.params.userId.length != 24) {
			return response.status(400).json({ message: "Invalid ID Parameter" });
		}
		const user = await User.findById(req.params.userId);
		if (!user) {
			return response.status(404).json({ message: "User not found!" });
		}
		const currentDate = new Date(req.body.date);
		const updateUser = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			hasProfilePicture: req.body.hasProfilePicture,
			birthdate: new Date(req.body.birthdate),
			sex: req.body.sex,
			heightCm: req.body.heightCm,
			activityLevel: req.body.activityLevel,
			currentWeightKg: {
				value: req.body.currentWeightKg.value,
				date: req.body.currentWeightKg.date,
			},
			currentPercentBodyFat: {
				value: req.body.currentPercentBodyFat.value,
				date: req.body.currentPercentBodyFat.date,
			},
      		startingPercentBodyFat: req.body.startingPercentBodyFat,
      		startingWeightKg: req.body.startingWeightKg,
			goals:{
				weightGoal:req.body.goals.weightGoal,
				calorieGoal:req.body.goals.calorieGoal,
				weightDelta:req.body.goals.weightDelta,
				macroBreakdown:{
					carbs:req.body.goals.macroBreakdown.carbs,
					fat:req.body.goals.macroBreakdown.fat,
					protein:req.body.goals.macroBreakdown.protein,
				}
			},
			preferences: {
				Location: req.body.preferences.Location,
				unitPreference: req.body.preferences.unitPreference,
				mealNames: req.body.preferences.mealNames,
			},
		};
		console.log(updateUser);

		let diary = await Diary.findOne({ userId: req.body.userId, timestamp: currentDate });

		if (diary) {
			diary.diaryWeightKg = req.body.currentWeightKg;
			diary.diaryPercentBodyFat = req.body.currentPercentBodyFat;
			diary.save();
		}

		const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateUser);
		response.status(200).json({ message: "User was successfully updated" });
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
});

//delete user profile entries
router.delete("/:userId", async (request, response) => {
	console.log("got request: ", request.params.userId);
	try {
		if (request.params.userId.length != 24) {
			return response.status(400).json({ message: "Invalid ID" });
		} else {
			await User.deleteOne({
				_id: request.params.userId,
			});
			response.status(200).json({ message: "Account deleted" });
		}
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
	// delete profile picture from the s3 bucket
});

//router.get('/:userId/analytics', async (request, response) => {

//})

module.exports = router;
