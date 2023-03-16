const express = require('express')
const router = express.Router()
const User = require("../models/profileSchema.js")
const { Types } = require('mongoose');

//retrieve user
router.get('/:userId', async (request,response) => {
    try {
        if (request.params.userId.length != 24) {
          response.status(400).json({ message: "Invalid ID Parameter" });
        } else {
          const user = await User.findById(request.params.userId);
          if (user === null) {
            response.status(404).json({ message: "User Not Found" });
          } else {
            response.status(200);
            response.send(user);
          }
        }
      } catch (e) {
        response.status(500).json({ message: "Internal Error" });
        console.log(e);
      }
})

//update user analytics
// router.patch('/:userId', async (request,response) => {
//   try {
//       if (request.params.userId.length != 24) {
//         response.status(400).json({ message: "Invalid ID Parameter" });
//       } else {
//         const user = await User.findById(request.params.userId);
//         if (user === null) {
//           response.status(404).json({ message: "User Not Found" });
//         } else {
//           response.status(200);
//           response.send(user);
//         }
//       }
//     } catch (e) {
//       response.status(500).json({ message: "Internal Error" });
//       console.log(e);
//     }
// })

//delete user analytics
// router.delete('/:userId', async (request,response) => {
//   try {
//       if (request.params.userId.length != 24) {
//         response.status(400).json({ message: "Invalid ID Parameter" });
//       } else {
//         const user = await User.findById(request.params.userId);
//         if (user === null) {
//           response.status(404).json({ message: "User Not Found" });
//         } else {
//           response.status(200);
//           response.send(user);
//         }
//       }
//     } catch (e) {
//       response.status(500).json({ message: "Internal Error" });
//       console.log(e);
//     }
// })


//router.get('/:userId/analytics', async (request, response) => {









//})

module.exports = router