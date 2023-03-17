const mongoose = require('mongoose')

const diary_schema = new mongoose.Schema({
    userId: String,
    timestamp: Date,
    numLogs: Number,
    meal1: {
      foodLogs: [
        {
          foodId: String,
          servingName: String,
          numServing: Number,
          quantityMetric: Number
        }
      ],
      recipeLogs: [
        {
          recipeId: String,
          numServing: Number
        }
      ]
    },
    meal2: {
      foodLogs: [
        {
          foodId: String,
          servingName: String,
          numServing: Number,
          quantityMetric: Number
        }
      ],
      recipeLogs: [
        {
          recipeId: String,
          numServing: Number
        }
      ]
    },
    meal3: {
      foodLogs: [
        {
          foodId: String,
          servingName: String,
          numServing: Number,
          quantityMetric: Number
        }
      ],
      recipeLogs: [
        {
          recipeId: String,
          numServing: Number
        }
      ]
    },
    meal4: {
      foodLogs: [
        {
          foodId: String,
          servingName: String,
          numServing: Number,
          quantityMetric: Number
        }
      ],
      recipeLogs: [
        {
          recipeId: String,
          numServing: Number
        }
      ]
    },
    meal5: {
      foodLogs: [
        {
          foodId: String,
          servingName: String,
          numServing: Number,
          quantityMetric: Number
        }
      ],
      recipeLogs: [
        {
          recipeId: String,
          numServing: Number
        }
      ]
    },
    meal6: {
      foodLogs: [
        {
          foodId: String,
          servingName: String,
          numServing: Number,
          quantityMetric: Number
        }
      ],
      recipeLogs: [
        {
          recipeId: String,
          numServing: Number
        }
      ]
    },
    exercise: {
      strengthLogs: [
          {
              exerciseId: String,
              sets: Number,
              reps: Number,
              weightKg: Number
          }
      ],
      cardioLogs: [
          {
              exerciseId: String,
              durationMinutes: Number 
          }
      ],
      workoutLogs: [
          {
            workoutId: String,
            workoutName: String,
            strengthExercises: [
              {
                exerciseId: String,
                sets: Number,
                reps: [Number],
                weightKg: [Number]
              }
            ],
            cardioExercises: [
              {
                exerciseId: String,
                durationMinutes: Number
              }
            ]
          }
      ]
    }
})

module.exports = mongoose.model('Diary', diary_schema)