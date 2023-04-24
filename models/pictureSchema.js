const mongoose = require("mongoose");
const picture_schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},

	fileName: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Picture", picture_schema);
