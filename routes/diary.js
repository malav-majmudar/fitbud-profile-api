const express = require('express')
const router = express.Router()
const Diary = require("../models/diarySchema.js")
const mongoose = require('mongoose');




router.post("/", async (request, response) => {
    console.log(request.body)
    try{
        const diary = new Diary({
            userId: request.body.userId,
            timestamp: new Date(request.query.date),
            numLogs: 29
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
            return response.status(201).send({message: "Diary Created!"});
        }
        catch(err){
            return response.status(400).send({message: err.message});
        }

    } catch(e){
        response.status(500).send({ message: "Internal Error" });
        console.log(e);
    }
})



router.patch("/:diaryId", async (request, response) => {
    console.log(request.body)
    const diaryId = request.params.diaryId
    const diary = await Diary.findById({ diaryId })
    try{
        if(diary.userId !== request.body.userId) {
            return response.status(400).send({ message: "Invalid user access!" });
        }
        else if(request.params.diaryId.length != 24) {
            return response.status(400).json({ message: "Invalid ID Parameter" });
        }

        else if(diary.numLogs === 0) {
            return response.status(400).send({ message: "You have ran out of logs!" });
        }
        

        else {
            diary.numLogs = diary.numLogs - 1

            if(request.body.type === "food") {
                console.log("food log will be accessed")
                if(request.body.action === "addLog") {
                    tempFoodLog = { foodId:request.body.contents.foodId, servingName:request.body.contents.servingName, numServing:request.body.contents.numServings, quantityMetric:request.body.contents.quantityMetric }
                    diary[request.body.contents.mealPosition].foodLogs.push(tempFoodLog)
                    console.log("food log added")
                }

                else if(request.body.action === "deleteLog") {
                    diary[request.body.contents.mealPosition].foodLogs.splice(request.body.contents.logPosition,1)
                    console.log("food log deleted")
                }
                
                else if(request.body.action === "updateLog") {
                    tempFoodLog = { foodId:request.body.contents.foodId, servingName:request.body.contents.servingName, numServing:request.body.contents.numServings, quantityMetric:request.body.contents.quantityMetric }
                    diary[request.body.contents.mealPosition].foodLogs.splice(request.body.contents.logPosition,1, tempFoodLog)
                    console.log("food log updated")
                }
            }

            else if(request.body.type === "recipe"){
                console.log("recipe log will be accessed")
                if(request.body.action === "addLog") {
                    tempRecipeLog = { recipeId:request.body.contents.recipeId, numServings:request.body.contents.numServings }
                    diary[request.body.contents.mealPosition].recipeLogs.push(tempRecipeLog)
                    console.log("recipe log added")
                }

                else if(request.body.action === "deleteLog") {
                    diary[request.body.contents.mealPosition].recipeLogs.splice(request.body.contents.logPosition,1)
                    console.log("recipe log deleted")
                }

                else if(request.body.action === "updateLog") {
                    tempRecipeLog = { recipeId:request.body.contents.recipeId, numServings:request.body.contents.numServings }
                    diary[request.body.contents.mealPosition].recipeLogs.splice(request.body.contents.logPosition,1, tempRecipeLog)
                    console.log("recipe log updated")
                }
            }

            else if(request.body.type === "strength") {
                console.log("strength log will be accessed")
                if(request.body.action === "addLog") {
                    tempStrengthLog = { exerciseId:request.body.contents.exerciseId, reps:request.body.content.reps, sets:request.body.content.sets, weightKg:request.body.content.weightKg }
                    diary['exercise'].strengthLogs.push(tempStrengthLog)
                    console.log("strength log added")
                }

                else if(request.body.action === "deleteLog") {
                    diary['exercise'].strengthLogs.splice(request.body.content.logPosition,1)
                    console.log("strength log deleted")
                }

                else if(request.body.action === "updateLog") {
                    tempStrengthLog = { exerciseId:request.body.contents.exerciseId, reps:request.body.content.reps, sets:request.body.content.sets, weightKg:request.body.content.weightKg }
                    diary['exercise'].strengthLogs.splice(request.body.content.logPosition,1, tempStrengthLog)
                    console.log("strength log updated")
                }
            }

            else if(request.body.type === "cardio") {
                console.log("cardio log will be accessed")
                if(request.body.action === "addLog") {
                    tempCardioLog = { exerciseId:request.body.contents.exerciseId, durationMinutes:request.body.contents.duration}
                    diary['exercise'].cardioLogs.push(tempCardioLog)
                    console.log("cardio log added")
                }

                else if(request.body.action === "deleteLog") {
                    diary['exercise'].cardioLogs.splice(request.body.content.logPosition,1)
                    console.log("cardio log deleted")
                }

                else if(request.body.action === "updateLog") {
                    tempCardioLog = { exerciseId:request.body.contents.exerciseId, durationMinutes:request.body.contents.duration}
                    diary['exercise'].cardioLogs.splice(request.body.content.logPosition,1,tempCardioLog)
                    console.log("cardio log updated")
                }
            }

            else if(request.body.type === "workout") {
                console.log("workout log will be accessed")
                if(request.body.action === "addLog") {
                    tempWorkoutLog = { workoutId:request.body.contents.workoutId, strengthExercises:request.body.contents.strengthExercises, cardioExercises:request.body.contents.cardioExercises }
                    diary['exercise'].workoutLogs.push(tempWorkoutLog)
                    console.log("workout log will be added")
                }

                else if(request.body.action === "deleteLog") {
                    diary['exercise'].workoutLogs.splice(request.body.logPosition,1)
                    console.log("workout log deleted")
                }

                else if(request.body.action === "updateLog") {
                    tempWorkoutLog = { workoutId:request.body.contents.workoutId, strengthExercises:request.body.contents.strengthExercises, cardioExercises:request.body.contents.cardioExercises }
                    diary['exercise'].workoutLogs.splice(request.body.logPosition,1,tempWorkoutLog)
                    console.log("workout log will be updated")
                }
            }
        }
        diary.save()
        response.status(200).send({ message: "Diary successfully updated!" });

    } catch(e){
        response.status(500).send({ message: "Internal Error" });
        console.log(e);
    }
})


router.get('/:diaryId', async (request, response) => {
    try {
        if(request.params.diaryId.length != 24) {
          response.status(400).send({ message: "Invalid ID Parameter!" });
        } 
        else {
          const diary = await Diary.findById(request.params.diaryId);
          if(diary === null) {
            response.status(404).send({ message: "Diary Not Found!" });
          } 
          
          else {
            response.status(200);
            response.send(diary);
          }
        }
      } catch (e) {
        response.status(500).send({ message: "Internal Error!" });
        console.log(e);
      }
})

router.get('/', async (request,response) => {
    try{
        if(request.query.userId.length != 24) {
            response.status(400).send({ message: "Invalid ID parameter!" });
        } 
        
        const datecheck = new RegExp(/^\d{4}-\d{2}-\d{2}$/)

        if(!datecheck(request.query.date)){
            response.status(400).send({ message: "Invalid date format!" });
        }

        const userId = new Mongoose.Types.ObjectId(request.query.userID)
        const date = new Date(request.query.date)
        const diary = await Diary.find({ userID: userId, date: date })

        if(diary === null) {
            response.status(404).send({ message: "Diary Not Found!" });
        }

        else{
            response.status(200);
            response.send(diary); 
        }
    } catch(e) {
        response.status(500).json({ message: "Internal Error" });
        console.log(e);
    }
})


module.exports = router