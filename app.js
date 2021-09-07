require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnection = require("./db");
const controllers = require("./controllers");
const middleware = require("./middleware");

// ! Middleware
app.use(middleware.CORS);
app.use(Express.json());

app.use("/auth", controllers.userscontroller);
app.use("/apps", controllers.applicationscontroller);

// ! DB connection
dbConnection.authenticate()
    .then(() => {
        dbConnection.sync()
    })
    .then(app.listen(process.env.PORT, () => {
        console.log('Got it workin???');
    }))
    .catch(err => {
        console.log(`Server crashed ${err}`);
    });