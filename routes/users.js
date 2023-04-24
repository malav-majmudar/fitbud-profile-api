const express = require("express");
const router = express.Router();
const User = require("../models/profileSchema.js");
const Diary = require("../models/diarySchema.js")

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey,
	},
	region: bucketRegion,
});

//retrieve user
router.get("/:userId", async (request, response) => {
	try {
		if (request.params.userId.length != 24) {
			response.status(400).json({ message: "Invalid ID Parameter" });
		} else {
			const user = await User.findById(request.params.userId);
			if (!user) {
				return response.status(404).json({ message: "User Not Found" });
			} else {
				response.status(200);
				response.send(user);
			}
		}
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
});

//get profile picture
router.get("/profilePicture/:userId", async (request, response) => {
	try {
		let user = await User.findById(request.params.userId);

		if(user.hasProfilePicture === true) {
			const getObjectParams = {
				Bucket: bucketName,
				Key: request.params.fileName,
			};

			const command = new GetObjectCommand(getObjectParams);
			const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
			response.status(200).send(url)
		}
		else {
			response.status(400).send({message: "User does not have a profile picture!"})
		}
	} catch (err) {
		response.status(500).json({ message: "Internal Error" });
		console.log(err);
	}
});

//add profile picture
router.post("/profilePicture", upload.single("image"), async (request, response) => {
	console.log("req.body", request.body);
	console.log("req.file", request.file);

	try {
		let user = await User.findById(request.body.userId);
		try {
			const params = {
				Bucket: bucketName,
				Key: String(request.body.userId),
				Body: request.file.buffer,
				ContentType: request.file.mimetype,
			};
		} catch (err) {
			return response.status(400).send({ message: `There was an issue with image request: Error: ${err.message}` })
		}
		const command = new PutObjectCommand(params);
		await s3.send(command);
		user.hasProfilePicture = true;
		response.status(201).send({ message: "Picture saved in database and s3!" });
	} catch (err) {
		response.status(500).send({ message: `There was an error: ${err.message}` });
	}
});


//update user profile entries
router.patch("/:userId", async (req, response) => {
	try {
		if (req.params.userId.length != 24) {
			return response.status(400).json({ message: "Invalid ID Parameter" });
		}
		const user = await User.findById(req.params.userId);
		if (!user) {
			return response.status(404).json({ message: "User not found!" });
		}
		const currentDate = new Date(req.body.date);
		const updateUser = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			profilePicture: req.body.profilePicture,
			birthdate: new Date(req.body.birthdate),
			sex: req.body.sex.toLowerCase(),
			heightCm: req.body.heightCm,
			currentWeightKg: {
				value: req.body.currentWeightKg,
				date: currentDate,
			},
			currentPercentBodyFat: {
				value: req.body.currentPercentBodyFat,
				date: currentDate,
			},
      startingPercentBodyFat: {
        value: req.body.startingPercentBodyFat,
      },
      startingWeightKg: {
        value: req.body.startingWeightKg,
      },
			goals: req.body.goals,
			preferences: {
				Location: req.body.preferences.Location,
				unitPreference: req.body.preferences.unitPreference,
				mealNames: req.body.preferences.mealNames,
			},
		};
		console.log(updateUser);

		let diary = await Diary.findOne({ userId: req.body.userId, timestamp: currentDate });

		if (diary) {
			diary.diaryWeightKg = req.body.currentWeightKg;
			diary.diaryPercentBodyFat = req.body.currentPercentBodyFat;
			diary.save();
		}

		const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateUser);
		response.status(200).json({ message: "User was successfully updated" });
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
});

//delete user profile entries
router.delete("/:userId", async (request, response) => {
	console.log("got request: ", request.params.userId);
	try {
		if (request.params.userId.length != 24) {
			return response.status(400).json({ message: "Invalid ID" });
		} else {
			await User.deleteOne({
				_id: request.params.userId,
			});
			response.status(200).json({ message: "Account deleted" });
		}
	} catch (e) {
		response.status(500).json({ message: "Internal Error" });
		console.log(e);
	}
	// delete profile picture from the s3 bucket
});

//router.get('/:userId/analytics', async (request, response) => {

//})

module.exports = router;
