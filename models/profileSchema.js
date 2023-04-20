const mongoose = require("mongoose");
const user_schema = new mongoose.Schema({
	// _id:{
	//     type: mongoose.Schema.Types.ObjectId,
	//     required: true
	// },

	firstName: {
		type: String,
		required: true,
	},

	lastName: {
		type: String,
		required: true,
	},

	profilePicture: {
		type: String,
		required: false,
	},

	timestamp: {
		type: Date,
		required: true,
		default: new Date(),
	},

	birthdate: {
		type: Date,
		required: true,
	},

	sex: {
		type: String,
		required: true,
		enum: ["male", "female"],
	},

	heightCm: {
		type: Number,
		required: true,
	},

	startingWeightKg: {
		type: Number,
		required: true,
	},

	startingWeightDate: {
		type: Date,
		required: false,
	},

	activityLevel: {
		type: String,
		required: false,
		default: "manual",
		enum: ["manual", "sedentary", "light", "moderate", "heavy", "very heavy"],
	},

	goals: {
		weightGoal: {
			type: Number,
			required: false,
			default: null,
		},

		weightDelta: {
			type: Number,
			required: false,
			default: 0,
			min: -4,
			max: 4,
		},

		macroBreakdown: {
			carbs: {
				type: Number,
				required: false,
				default: 0.33,
                min: 0,
                max: 1
			},

			fat: {
				type: Number,
				required: false,
				default: 0.33,
                min: 0,
                max: 1
			},

			protein: {
				type: Number,
				required: false,
				default: 0.34,
                min: 0,
                max: 1
			},
		},
	},

	preferences: {
		Location: {
			type: String,
			requried: false,
		},

		unitPreference: {
			type: String,
			required: true,
			default: "imperial",
			enum: ["imperial", "metric"],
		},

		mealNames: {
			type: Array,
			required: true,
            default: ["Breakfast", "Lunch", "Dinner", "Snacks", null, null]
		},
	},
});

module.exports = mongoose.model("User", user_schema);
