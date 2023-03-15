const express = require('express')
const router = express.Router()
const User = require("../models/profileSchema.js")


router.get('/:userId', async (request,response) => {
    try {
        if (request.params.userId.length != 24) {
          response.status(400).json({ message: "Invalid ID" });
        } else {
          let user = await User.findById(request.params.userId);
          Reflect.deleteProperty(user, 'saltedHashedPass')
          console.log(user);
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


module.exports = router