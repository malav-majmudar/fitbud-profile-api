const express = require('express')
const router = express.Router()
const Diary = require("../models/diarySchema.js")
const mongoose = require('mongoose');




router.post("/", async (request, response) => {
    console.log(request.body)
    try{
        const diary = new Diary({
            userId: request.body.userId,
            timestamp: request.query.date,
            numLogs: 50
        })
        console.log(diary)
        if(request.body.type === "food") {
            tempFoodLog = { foodId:request.body.contents.foodId, servingName:request.body.contents.servingName, numServing:request.body.contents.numServings, quantityMetric:request.body.contents.quantityMetric }
            diary[request.body.contents.mealPosition].foodLogs.push(tempFoodLog)
        }
    
        else if(request.body.type === "recipe") {
            tempRecipeLog = { recipeId:request.body.contents.recipeId, numServings:request.body.contents.numServings }
            diary[request.body.contents.mealPosition].recipeLogs.push(tempRecipeLog)
        }
    
        else if(request.body.type === "strength") {
            tempStrengthLog = { exerciseId:request.body.contents.exerciseId, reps:request.body.content.reps, sets:request.body.content.sets, weightKg:request.body.content.weightKg }
            diary['exercise'].strengthLogs.push(tempStrengthLog)
        }
    
        else if(request.body.type === "cardio") {
            tempCardioLog = { exerciseId:request.body.contents.exerciseId, durationMinutes:request.body.contents.duration}
            diary['exercise'].cardioLogs.push(tempCardioLog)
        }
    
        else if(request.body.type === "workout") {
            tempWorkoutLog = { workoutId:request.body.contents.workoutId, strengthExercises:request.body.contents.strengthExercises, cardioExercises:request.body.contents.cardioExercises }
            diary['exercise'].workoutLogs.push(tempWorkoutLog)
        }
        
        try{
            const newdiary = await diary.save()
            response.status(201).json({message: "Diary Created!"})
        }
        catch(err){
            response.status(400).json({message: err.message})
        }

    } catch(e){
        response.status(500).json({ message: "Internal Error" });
        console.log(e);
    }
})



// router.patch("/:diaryId", async (request, response) => {
//     try{
//         if (request.params.diaryId.length != 24) {
//             response.status(400).json({ message: "Invalid ID Parameter" });
//           }
//         else {
//             const diary = 
//         }
//     } catch(e){
//         response.status(500).json({ message: "Internal Error" });
//         console.log(e);
//     }







// })


module.exports = router