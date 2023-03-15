const mongoose = require('mongoose')
const user_schema = new mongoose.Schema({    
    firstName:{
        type: String,
        required: true
    },

    lastName:{
        type: String,
        required: true
    },

    profilePicture:{
        type: String, 
        required: false
    },

    birthdate:{
        type: Date,
        required: false
    },

    sex:{
        type: String,
        required: false
    },

    heightCM:{
        type: Number,
        required: false
    },

    startingWeightKg:{
        type: Number,
        required: false
    },

    startingWeightDate:{
        type: Date,
        required: false
    },

    currentWeightKg:{
        type: Number,
        required: false
    },

    percentBodyFat:{
        type: Number,
        required: false,
    },

    goals:{
        weightGoal:{
            type: Number,
            required: false
        },

        weightDelta:{
            type: Number,
            required: false
        },

        macroBreakdown:{
            carbs:{
                type: Number,
                required: false
            },

            fat:{
                type: Number,
                required: false
            },

            protein:{
                type: Number,
                required: false
            }
        }
    },

    preferences:{
        Location:{
            type: String,
            requried: false
        },

        unitPreference:{
            type: String,
            required: false
        },

        mealNames:{
            type: Array,
            required: false
        }
    }
})

module.exports = mongoose.model('User', user_schema)


