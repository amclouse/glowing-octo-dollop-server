const Express = require("express");
const router = Express.Router();
const { models } = require("../db");
const bcrypt = require("bcryptjs");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
// const { values } = require("sequelize/types/lib/operators");
const { validateSession } = require("../middleware");

router.post("/signup", async (req, res) => {
  const { username, password } = req.body.user;

  try {
    
    //Initial creation, use object destructuring to funnel data into correct keys/values of req.body.user
    let newUser = await models.UserModel.create({
      username: username,
      password: bcrypt.hashSync(password, 10),
      // role: role,
      // token: token
    })
      //Send status 201, confirming user was created and send back json object to client.
      .then((user) => {
        // let token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        //   expiresIn: 60 * 60 * 24,
        // });
        res.status(201).json({
          user: user,
          message: "user created",
          // token: `Bearer ${token}`
        });
      });
  } catch (error) {
    //Send status 409 if duplicate username
    if (error instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Username already in use",
      });
    } else {
      //Send status 500 if user not registered
      res.status(500).json({
        error: `Failed to register user: ${error}`,
      });
    }
  }
});



router.post("/login", async (req, res) => {
  let { username, password } = req.body.user;

  try {
    //Use object destructuring to funnel data into correct keys/values of req.body.user
    let loginUser = await models.UserModel.findOne({
      //Test if username matches an entry
      where: {
        username: username,
      },
    });
    //If username is found, compare encrypted password
    if (loginUser) {
      let passwordComparison = await bcrypt.compare(
        password,
        loginUser.password
      );
      //If password comparison matches, assign a token that expires in 24 hrs
      if (passwordComparison) {
        
        let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
        });
        //Send status 200, confirming user was logged in and issue token.
        res.status(200).json({
          user: loginUser,
          message: "User successfully logged in!",
          token: token,
        });
      } else {
        //Send status 403 if no password match
        res.status(403).json({
          message: "Incorrect password",
        });
      };
    } else {
      //Send status 401 if no username match
      res.status(401).json({
        message: "Incorrect username",
      });
    };
  } catch (error) {
    console.log(req.body.user);
    //Send status 500 if user not logged in
    res.status(500).json({
      message: `Failed to log user in ${error}`,
    });
  };
});

//! Add student
router.post("/addStudent", validateSession, (req, res) => {

  let { userId, studentList } = req.user.id

  let query = {
    where: {
      userId: userId,
    }
  }

  try {
    
    let addStudent = models.UsersModel.create({
      
    })

  } catch (error) {
    
  }

})

module.exports = router