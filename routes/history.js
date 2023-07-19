const express = require("express");
const router = express.Router();
const History = require("../models/historySchema.js");

router.get("/:userId", async (request, response) => {
	try {
		if (request.params.userId.length != 24) {
			response.status(400).json({ message: "Invalid ID Parameter" });
		} else {
			const recentHistory = await History.findById(request.params.userId);
			if (!recentHistory) {
				return response.status(404).json({ message: "History Not Found" });
			} else {
				response.status(200);
				response.send(recentHistory.searchHistory);
			}
		}
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
});

router.delete("/:userId", async (request, response) => {
	try {
		if (request.params.userId.length != 24) {
			return response.status(400).json({ message: "Invalid ID Parameter" });
		} else {
			await History.deleteOne({
				_id: request.params.userId,
			});
			response.status(200).json({ message: "History deleted" });
		}
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
});

module.exports = router;
