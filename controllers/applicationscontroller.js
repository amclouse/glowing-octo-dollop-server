const Express = require("express");
const router = Express.Router();
const { models } = require("../db");
const { validateSession } = require("../middleware/");

router.post("/create", validateSession, async (req, res) => {
  const { companyName, role, date  } = req.body.application;
  const { id } = req.user;
  console.log(id)

  try {
    //initial creation, use object destructuring to funnel data into correct keys/values of req.body.log
    //and check user id
    await models.ApplicationModel.create({
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


router.put("/update/:applicationId", validateSession, async (req, res) => {
  //Initial update, use object destructuring to funnel data into correct keys/values of req.body.log
  const { companyName, role, date  } = req.body.application;
  //req.params pertains to ":workoutId" in the url
  const { applicationId } = req.params;
  const userId = req.user.id;

  //Sequelize query asking for userId, and matching workout id's.
  const query = {
    where: {
      id: applicationId,
      userId: userId,
    },
  };

  //Key/values to be updated
  const updatedApp = {
    companyName: companyName,
    role: role,
    date: date,
    userId: userId,
  };

  try {
    //Find particular workout user is wanting
    const foundApp = await models.ApplicationsModel.findOne(query);

    //If we found a log with matching id, go ahead and update the log under condition
    if (foundApp) {
      //Update method takes in updated information, and makes sure query matches as well.
      await models.ApplicationsModel.update(updatedApp, query);
      res.status(200).json({ message: `log updated` });
    } else {
      res.status(403).json({ msg: "Cannot update log" });
    }
  } catch (error) {
    //Send error message to client
    res.status(500).json({ error: `${error}` });
  }
});


router.delete("/delete/:applicationId", validateSession, async (req, res) => {
  const userId = req.user.id;
  //req.params pertains to ":workoutId" in the url
  const { applicationId } = req.params;

  //Sequelize query asking for userId, and matching workout id's.
  const query = {
    where: {
      id: applicationId,
      userId: userId,
    },
  };

  try {
    //Destroy (delete) particular workout user is targeting
    const appToDelete = await models.ApplicationsModel.destroy(query);

    //If we've found a log that matches the workout id and user id, we will delete it and send msg.
    if (appToDelete) {
      res.status(200).json({ msg: "Log deleted" });
    } else {
      //If we've not found a log that matches workout id and user id, send msg.
      res
        .status(403)
        .json({
          msg: "You are not logsorized to delete this log, or log does not exist.",
        });
    }
  } catch (error) {
    //Send error message to client
    res.status(200).json({ error: error });
  }
});

module.exports = router;
