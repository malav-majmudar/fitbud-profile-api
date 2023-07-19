const express = require("express");
const router = express.Router();
const Diary = require("../models/diarySchema.js");
const User = require("../models/profileSchema.js");
const History = require("../models/historySchema.js");
const mongoose = require("mongoose");
const NUMSEARCHHISTORY = 50;
const NUMDIARYENTRIES = 30;

router.post("/", async (request, response) => {
	//logging the request to the console for debugging purposes, as well as searching for the user
	console.log(request.body);
	let user = await User.findById(request.body.userId);

	if (!user) {
		return response.status(404).send({ message: "User not found!" });
	}

	console.log(user);

	//getting the weight and body fat objects to store in the diary upon creation
	const currentWeight = user.currentWeightKg;
	const percentBodyFat = user.currentPercentBodyFat;

	console.log(user.currentWeightKg);
	console.log(user.currentPercentBodyFat);
	//creating the new diary, running through several if statements to check which log is being added currently and adding it
	try {
		const diary = new Diary({
			userId: request.body.userId,
			timestamp: new Date(request.query.date),
			numLogs: NUMDIARYENTRIES,
			diaryWeightKg: currentWeight.value,
			diaryPercentBodyFat: percentBodyFat.value,
		});
		//diary log type is food
		if (request.body.type === "food") {
			tempFoodLog = {
				foodId: request.body.contents.foodId,
				servingName: request.body.contents.servingName,
				numServings: request.body.contents.numServings,
				quantityMetric: request.body.contents.quantityMetric,
			};
			diary[request.body.contents.mealPosition].foodLogs.push(tempFoodLog);
			diary.numLogs = diary.numLogs - 1;

			//for now in the food request only, we are saving recent foods added. We check under the food request if the user has
			//recent logs already and will append or move the food if they do. If not, we create a new log and add the first entry
			let recentLogs = await History.findById(request.body.userId);
			console.log(recentLogs);
			if (!recentLogs) {
				console.log("Intializing a new log");
				const newLog = new History({
					_id: request.body.userId,
				});

				tempSearchLog = {
					_id: request.body.contents.foodId,
					name: request.body.contents.name,
					brandName: request.body.contents.brandName,
					brandOwner: request.body.contents.brandOwner,
					isVerified: request.body.contents.isVerified,
				};
				console.log(tempSearchLog);

				newLog.searchHistory.push(tempSearchLog);
				await newLog.save();
			}

			//now we have to deal with creating an appropriate "recent" foods added. This current search will be prioritized and moved to the top.
			//Once the user has extended past 50 recent searches, we will start removing the last entry and add the new one. Also, of the food
			//already exists in their searches, we have to move the old one to the top
			else {
				console.log("Updating current searches");
				let foodId = request.body.contents.foodId;

				tempSearchLog = {
					_id: request.body.contents.foodId,
					name: request.body.contents.name,
					brandName: request.body.contents.brandName,
					brandOwner: request.body.contents.brandOwner,
					isVerified: request.body.contents.isVerified,
				};
				//callback function to find if the foodId already exists
				function FindByFoodId(searchLog) {
					if (searchLog._id == this) {
						return true;
					}
				}
				console.log(recentLogs.searchHistory.findIndex(FindByFoodId, foodId));
				if (recentLogs.searchHistory.findIndex(FindByFoodId, foodId) === -1) {
					console.log("Item was not found, we add it to the front");
					if (recentLogs.searchHistory.length < NUMSEARCHHISTORY) {
						console.log("Less than 50 items, just append to front");
						console.log(tempSearchLog);
						recentLogs.searchHistory = [tempSearchLog, ...recentLogs.searchHistory];
					} else {
						console.log("Surpassed 50 items, pop the last item and add the current one to the front");
						console.log(tempSearchLog);
						recentLogs.searchHistory = [tempSearchLog, ...recentLogs.searchHistory];
						recentLogs.searchHistory.pop();
					}
				} else {
					console.log("Remove it from the middle and append to front");
					console.log(tempSearchLog);
					recentLogs.searchHistory.splice(recentLogs.searchHistory.findIndex(FindByFoodId, foodId), 1);
					recentLogs.searchHistory = [tempSearchLog, ...recentLogs.searchHistory];
				}
				await recentLogs.save();
			}
			//diary log type is recipe
		} else if (request.body.type === "recipe") {
			tempRecipeLog = {
				recipeId: request.body.contents.recipeId,
				numServings: request.body.contents.numServings,
			};
			diary[request.body.contents.mealPosition].recipeLogs.push(tempRecipeLog);
			diary.numLogs = diary.numLogs - 1;

			//diary log type is strength
		} else if (request.body.type === "strength") {
			tempStrengthLog = {
				exerciseId: request.body.contents.exerciseId,
				reps: request.body.contents.reps,
				sets: request.body.contents.sets,
				weightKg: request.body.contents.weightKg,
				kcal: request.body.contents.kcal,
			};
			diary["exercise"].strengthLogs.push(tempStrengthLog);
			diary.numLogs = diary.numLogs - 1;
			//diary log type is cardio
		} else if (request.body.type === "cardio") {
			tempCardioLog = {
				exerciseId: request.body.contents.exerciseId,
				durationMinutes: request.body.contents.durationMinutes,
				kcal: request.body.contents.kcal,
			};
			diary["exercise"].cardioLogs.push(tempCardioLog);
			diary.numLogs = diary.numLogs - 1;
			//diary log type is workout
		} else if (request.body.type === "workout") {
			tempWorkoutLog = {
				workoutId: request.body.contents.workoutId,
				strengthExercises: request.body.contents.strengthExercises,
				cardioExercises: request.body.contents.cardioExercises,
			};
			diary.numLogs = diary.numLogs - 1;
			diary["exercise"].workoutLogs.push(tempWorkoutLog);
		}

		//saving the diary after we are done finding what the first log is
		try {
			const newdiary = await diary.save();
			//returning the diary to the frontend
			return response.status(201).send(diary);
		} catch (err) {
			return response.status(400).send({ message: err.message });
		}
	} catch (e) {
		response.status(500).send({ message: "Internal Error" });
		console.log(e);
	}
});

router.patch("/:diaryId", async (request, response) => {
	//logging the body for debugging purposes, retrieving the diary the user is attempting to edit so we can change
	//the contents
	console.log(request.body);
	const diaryId = request.params.diaryId;
	const diary = await Diary.findById(diaryId);

	//try catch related to various errors that might occur
	try {
		if (String(diary.userId) !== request.body.userId) {
			return response.status(400).send({ message: "Invalid user access!" });
		} else if (request.params.diaryId.length != 24) {
			return response.status(400).send({ message: "Invalid ID Parameter" });
		} else if (diary.numLogs === 0) {
			return response.status(400).send({ message: "You have ran out of logs!" });
		} else {
			//similar to the post, we match what type of log is being chosen, what type of action will be done, and then executing said action
			//many of the next ifs deal with that
			if (request.body.type === "food") {
				console.log("food log will be accessed");
				console.log(request.body.action === "addLog");
				console.log(request.body.action === "deleteLog");
				console.log(request.body.action === "updateLog");

				//for now in the food request only, we are saving recent foods added. We check under the food request if the user has
				//recent logs already and will append or move the food if they do. If not, we create a new log and add the first entry
				let recentLogs = await History.findById(request.body.userId);
				console.log(recentLogs);
				if (!recentLogs) {
					console.log("Intializing a new log");
					const newLog = new History({
						_id: request.body.userId,
					});

					tempSearchLog = {
						_id: request.body.contents.foodId,
						name: request.body.contents.name,
						brandName: request.body.contents.brandName,
						brandOwner: request.body.contents.brandOwner,
						isVerified: request.body.contents.isVerified,
					};
					console.log(tempSearchLog);

					newLog.searchHistory.push(tempSearchLog);
					await newLog.save();
				}

				//now we have to deal with creating an appropriate "recent" foods added. This current search will be prioritized and moved to the top.
				//Once the user has extended past 50 recent searches, we will start removing the last entry and add the new one. Also, of the food
				//already exists in their searches, we have to move the old one to the top
				else {
					console.log("Updating current searches");
					let foodId = request.body.contents.foodId;

					tempSearchLog = {
						_id: request.body.contents.foodId,
						name: request.body.contents.name,
						brandName: request.body.contents.brandName,
						brandOwner: request.body.contents.brandOwner,
						isVerified: request.body.contents.isVerified,
					};
					//callback function to find if the foodId already exists
					function FindByFoodId(searchLog) {
						if (searchLog._id == this) {
							return true;
						}
					}
					console.log(recentLogs.searchHistory.findIndex(FindByFoodId, foodId));
					if (recentLogs.searchHistory.findIndex(FindByFoodId, foodId) === -1) {
						console.log("Item was not found, we add it to the front");
						if (recentLogs.searchHistory.length < NUMSEARCHHISTORY) {
							console.log("Less than 50 items, just append to front");
							console.log(tempSearchLog);
							recentLogs.searchHistory = [tempSearchLog, ...recentLogs.searchHistory];
						} else {
							console.log("Surpassed 50 items, pop the last item and add the current one to the front");
							console.log(tempSearchLog);
							recentLogs.searchHistory = [tempSearchLog, ...recentLogs.searchHistory];
							recentLogs.searchHistory.pop();
						}
					} else {
						console.log("Remove it from the middle and append to front");
						console.log(tempSearchLog);
						recentLogs.searchHistory.splice(recentLogs.searchHistory.findIndex(FindByFoodId, foodId), 1);
						recentLogs.searchHistory = [tempSearchLog, ...recentLogs.searchHistory];
					}
					await recentLogs.save();
				}

				if (request.body.action === "addLog") {
					tempFoodLog = {
						foodId: request.body.contents.foodId,
						servingName: request.body.contents.servingName,
						numServings: request.body.contents.numServings,
						quantityMetric: request.body.contents.quantityMetric,
					};
					console.log(tempFoodLog);
					diary[request.body.contents.mealPosition].foodLogs.push(tempFoodLog);
					diary.numLogs = diary.numLogs - 1;
					console.log("food log added");
				} else if (request.body.action === "deleteLog") {
					diary[request.body.contents.mealPosition].foodLogs.splice(request.body.contents.logPosition, 1);
					diary.numLogs = diary.numLogs + 1;
					console.log("food log deleted");
				} else if (request.body.action === "updateLog") {
					tempFoodLog = {
						foodId: request.body.contents.foodId,
						servingName: request.body.contents.servingName,
						numServings: request.body.contents.numServings,
						quantityMetric: request.body.contents.quantityMetric,
					};
					console.log(tempFoodLog);
					diary[request.body.contents.mealPosition].foodLogs.splice(request.body.contents.logPosition, 1, tempFoodLog);
					console.log("food log updated");
				}
			} else if (request.body.type === "recipe") {
				console.log("recipe log will be accessed");
				console.log(request.body.action === "addLog");
				console.log(request.body.action === "deleteLog");
				console.log(request.body.action === "updateLog");
				if (request.body.action === "addLog") {
					tempRecipeLog = {
						recipeId: request.body.contents.recipeId,
						numServings: request.body.contents.numServings,
					};
					console.log(tempRecipeLog);
					diary[request.body.contents.mealPosition].recipeLogs.push(tempRecipeLog);
					diary.numLogs = diary.numLogs - 1;
					console.log("recipe log added");
				} else if (request.body.action === "deleteLog") {
					diary[request.body.contents.mealPosition].recipeLogs.splice(request.body.contents.logPosition, 1);
					diary.numLogs = diary.numLogs + 1;
					console.log("recipe log deleted");
				} else if (request.body.action === "updateLog") {
					tempRecipeLog = {
						recipeId: request.body.contents.recipeId,
						numServings: request.body.contents.numServings,
					};
					console.log(tempRecipeLog);
					diary[request.body.contents.mealPosition].recipeLogs.splice(request.body.contents.logPosition, 1, tempRecipeLog);
					console.log("recipe log updated");
				}
			} else if (request.body.type === "strength") {
				console.log("strength log will be accessed");
				console.log(request.body.action === "addLog");
				console.log(request.body.action === "deleteLog");
				console.log(request.body.action === "updateLog");
				if (request.body.action === "addLog") {
					tempStrengthLog = {
						exerciseId: request.body.contents.exerciseId,
						reps: request.body.contents.reps,
						sets: request.body.contents.sets,
						weightKg: request.body.contents.weightKg,
						kcal: request.body.contents.kcal,
					};
					console.log(tempStrengthLog);
					diary["exercise"].strengthLogs.push(tempStrengthLog);
					diary.numLogs = diary.numLogs - 1;
					console.log("strength log added");
				} else if (request.body.action === "deleteLog") {
					diary["exercise"].strengthLogs.splice(request.body.contents.logPosition, 1);
					diary.numLogs = diary.numLogs + 1;
					console.log("strength log deleted");
				} else if (request.body.action === "updateLog") {
					tempStrengthLog = {
						exerciseId: request.body.contents.exerciseId,
						reps: request.body.contents.reps,
						sets: request.body.contents.sets,
						weightKg: request.body.contents.weightKg,
						kcal: request.body.contents.kcal,
					};
					console.log(tempStrengthLog);
					diary["exercise"].strengthLogs.splice(request.body.contents.logPosition, 1, tempStrengthLog);
					console.log("strength log updated");
				}
			} else if (request.body.type === "cardio") {
				console.log("cardio log will be accessed");
				console.log(request.body.action === "addLog");
				console.log(request.body.action === "deleteLog");
				console.log(request.body.action === "updateLog");
				if (request.body.action === "addLog") {
					tempCardioLog = {
						exerciseId: request.body.contents.exerciseId,
						durationMinutes: request.body.contents.durationMinutes,
						kcal: request.body.contents.kcal,
					};
					console.log(tempCardioLog);
					diary["exercise"].cardioLogs.push(tempCardioLog);
					diary.numLogs = diary.numLogs - 1;
					console.log("cardio log added");
				} else if (request.body.action === "deleteLog") {
					diary["exercise"].cardioLogs.splice(request.body.contents.logPosition, 1);
					diary.numLogs = diary.numLogs + 1;
					console.log("cardio log deleted");
				} else if (request.body.action === "updateLog") {
					tempCardioLog = {
						exerciseId: request.body.contents.exerciseId,
						durationMinutes: request.body.contents.durationMinutes,
						kcal: request.body.contents.kcal,
					};
					console.log(tempCardioLog);
					diary["exercise"].cardioLogs.splice(request.body.contents.logPosition, 1, tempCardioLog);
					console.log("cardio log updated");
				}
			} else if (request.body.type === "workout") {
				console.log("workout log will be accessed");
				console.log(request.body.action === "addLog");
				console.log(request.body.action === "deleteLog");
				console.log(request.body.action === "updateLog");
				if (request.body.action === "addLog") {
					tempWorkoutLog = {
						workoutId: request.body.contents.workoutId,
						strengthExercises: request.body.contents.strengthExercises,
						cardioExercises: request.body.contents.cardioExercises,
					};
					console.log(tempWorkoutLog);
					diary["exercise"].workoutLogs.push(tempWorkoutLog);
					diary.numLogs = diary.numLogs - 1;
					console.log("workout log will be added");
				} else if (request.body.action === "deleteLog") {
					diary["exercise"].workoutLogs.splice(request.body.logPosition, 1);
					diary.numLogs = diary.numLogs + 1;
					console.log("workout log deleted");
				} else if (request.body.action === "updateLog") {
					tempWorkoutLog = {
						workoutId: request.body.contents.workoutId,
						strengthExercises: request.body.contents.strengthExercises,
						cardioExercises: request.body.contents.cardioExercises,
					};
					console.log(tempWorkoutLog);
					diary["exercise"].workoutLogs.splice(request.body.logPosition, 1, tempWorkoutLog);
					console.log("workout log will be updated");
				}
			}
		}
		//saving the diary once it is finished to reflect the changes
		diary.save();
		response.status(200).send({ message: "Diary successfully updated!" });
	} catch (e) {
		response.status(500).send({ message: "Internal Error" });
		console.log(e);
	}
});

router.get("/:diaryId", async (request, response) => {
	//retrieving the diary that the user wants to view if they have the specific diary id
	try {
		if (request.params.diaryId.length != 24) {
			response.status(400).send({ message: "Invalid ID Parameter!" });
		} else {
			const diary = await Diary.findById(request.params.diaryId);
			if (diary === null) {
				response.status(404).send({ message: "Diary Not Found!" });
			} else {
				response.status(200);
				response.send(diary);
			}
		}
	} catch (e) {
		response.status(500).send({ message: "Internal Error!" });
		console.log(e);
	}
});

router.get("/", async (request, response) => {
	try {
		if (request.query.userId.length != 24) {
			response.status(400).send({ message: "Invalid ID parameter!" });
		}

		//this diary retrieval is based on the date a user picks for the diary. If the format isn't correct, we throw an error
		//that reflects that, otherwise we find the diary and send it back if it is found
		const datecheck = new RegExp(/^\d{4}-\d{2}-\d{2}$/);

		if (!datecheck.test(request.query.date)) {
			response.status(400).send({ message: "Invalid date format!" });
		}

		const userId = new mongoose.Types.ObjectId(request.query.userId);
		const date = new Date(request.query.date);
		console.log("date: ", date);
		console.log("userId:", userId);
		const diary = await Diary.findOne({ userId: userId, timestamp: date });

		if (!diary) {
			response.status(404).send({ message: "Diary Not Found!" });
		} else {
			console.log(diary);
			response.status(200);
			response.send(diary);
		}
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
});

router.delete("/", async (request, response) => {
	//deleting all the diaries once a user decides to remove their account. Individual diaries can be deleted in the patch section
	try {
		if (request.query.userId.length != 24) {
			response.status(400).json({ message: "Invalid UserId" });
		} else {
			const diary = await Diary.deleteMany({
				userId: request.query.userId,
			});
			console.log(diary);
			if (diary.deletedCount === 0) {
				response.status(404).json({ message: "Diaries Not Found" });
			} else {
				response.status(200);
				response.send({ message: "Diaries successfully deleted!" });
			}
		}
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
});

module.exports = router;
