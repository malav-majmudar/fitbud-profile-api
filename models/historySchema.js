const mongoose = require("mongoose");
const history_schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},

	searchHistory: [
		{
			foodId: {
				type: String,
				required: false,
			},

			name: {
				type: String,
				required: false,
			},

			brandName: {
				type: String,
				required: false,
			},

			brandOwner: {
				type: String,
				required: false,
			},
			isVerified: {
				type: Boolean,
				required: false,
			},
		},
	],
});

module.exports = mongoose.model("History", history_schema);
