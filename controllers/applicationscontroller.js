const Express = require("express");
const router = Express.Router();
const { models } = require("../models");
const bcrypt = require("bcryptjs");
const { validateSession } = require("../middleware/");

router.post("/create", validateSession, async (req, res) => {
  const { companyName, role, date  } = req.body.application;
  const { id } = req.user;
  console.log(id)

  try {
    //initial creation, use object destructuring to funnel data into correct keys/values of req.body.log
    //and check user id
    await models.ApplicationsModel.create({
      companyName: companyName,
      role: role,
      date: date,
      userId: id,
    })
      //Send status 201, confirming log was created and send back json object to client.
      .then((app) => {
        res.status(201).json({
          app: app,
          message: "app created",
        });
      });
  } catch (error) {
    //Send error message to client
    res.status(500).json({
      error: `Failed to create post: ${error}`,
    });
  } 
}); 

router.get("/myApps", validateSession, async (req, res) => {
  //Object destructuring, could probably use req.user.id, but keeping continuity through all routes currently.
  let { id } = req.user;
  try {
    //Find all method will return logs that belong to user where userId matches.
    const myApps = await models.ApplicationsModel.findAll({
      where: {
        userId: id,
      },
    });
    //Send status and json object containing all key/values in workouts table
    // that match user id
    res.status(200).json(myApps);
  } catch (error) {
    //Send error message to client
    res.status(500).json({ error: error });
  }
});

module.exports = router;
