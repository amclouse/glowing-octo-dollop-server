const Express = require("express");
const router = Express.Router();
const { models } = require("../models");
const bcrypt = require("bcryptjs");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { validateSession } = require("../middleware/")


router.post("/create", async (req, res) => {
    const { companyName, role, date, status } = req.body.applications;
  
    try {
      //initial creation, use object destructuring to funnel data into correct keys/values of req.body.log
      //and check user id
      await models.ApplicationsModel.create({
        companyName: companyName,
        role: role,
        date: date,
        userId: req.user.id,
      })
        //Send status 201, confirming log was created and send back json object to client.
        .then((app) => {
          res.status(201).json({
            // application: application,
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

module.exports = router