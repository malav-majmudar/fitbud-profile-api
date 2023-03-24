const mongoose = require('mongoose')
const diary_schema = new mongoose.Schema({
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    timestamp:{ 
      type: Date,
      required: true
    },

    numLogs:{
      type: Number,
      required: true
    },

    meal1:{
      foodLogs:[
        {
          foodId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          servingName:{
            type: String,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          },
          
          quantityMetric:{
            type: Number,
            required: false
          }
        }
      ],

      recipeLogs:[
        {
          recipeId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          }
        }
      ]
    },

    meal2:{
      foodLogs:[
        {
          foodId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          servingName:{
            type: String,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          },
          
          quantityMetric:{
            type: Number,
            required: false
          }
        }
      ],

      recipeLogs:[
        {
          recipeId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          }
        }
      ]
    },

    meal3:{
      foodLogs:[
        {
          foodId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          servingName:{
            type: String,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          },
          
          quantityMetric:{
            type: Number,
            required: false
          }
        }
      ],

      recipeLogs:[
        {
          recipeId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          }
        }
      ]
    },

    meal4:{
      foodLogs:[
        {
          foodId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          servingName:{
            type: String,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          },
          
          quantityMetric:{
            type: Number,
            required: false
          }
        }
      ],

      recipeLogs:[
        {
          recipeId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          }
        }
      ]
    },

    meal5:{
      foodLogs:[
        {
          foodId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          servingName:{
            type: String,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          },
          
          quantityMetric:{
            type: Number,
            required: false
          }
        }
      ],

      recipeLogs:[
        {
          recipeId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          }
        }
      ]
    },

    meal6:{
      foodLogs:[
        {
          foodId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          servingName:{
            type: String,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          },
          
          quantityMetric:{
            type: Number,
            required: false
          }
        }
      ],

      recipeLogs:[
        {
          recipeId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          numServing:{
            type: Number,
            required: false
          }
        }
      ]
    },

    exercise:{
      strengthLogs:[
        {
          exerciseId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          sets:{
            type: Number,
            required: false
          },

          reps:{
            type: Number,
            required: false
          },

          weightKg:{
            type: Number,
            required: false
          }
        }
      ],

      cardioLogs:[
        {
          exerciseId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          durationMinutes:{
            type: Number,
            required: false
          }
        }
      ],

      workoutLogs:[
        {
          workoutId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
          },

          workoutName:{
            type: String,
            required: false
          },

          strengthExercises:[
            {
              exerciseId:{
                type: mongoose.Schema.Types.ObjectId,
                required: false
              },

              sets:{
                type: Number,
                required: false
              },

              reps: [{
                type: Number,
                required: false
              }],

              weightKg: [{
                type: Number,
                required: false
              }]
            }
          ],

          cardioExercises:[
            {
              exerciseId:{
                type: mongoose.Schema.Types.ObjectId,
                required: false
              },

              durationMinutes:{
                type: Number,
                required: false
              }
            }
          ]
        }
      ]
    }
})

module.exports = mongoose.model('Diary', diary_schema)