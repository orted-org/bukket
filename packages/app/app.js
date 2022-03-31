//3rd party packages
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const app = express();

//getting the port, but nginx has been configured for port 3000
const PORT = process.env.PORT || 3000;

//Security
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
app.use(xss());
app.use(mongoSanitize());
app.use(helmet());
app.use(cors({ credentials: true, origin: process.env.REACT_URI }));
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Java Spring");
  next();
});

//for nginx proxy setup
app.enable("trust proxy");

//connecting to mongo operation
const mongoConnect = require("./Helpers/Helper.MongoInit").mongoConnect;

//connecting to redis
require("./Helpers/Helper.RedisInit");

//Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//HTTP Logging
app.use(morgan("tiny"));

/*---------------------------------------------------*/
// All Routes Here

const User = require("./Routes/Route.User");
app.use("/user", User);

const BucketRoutes = require("./Routes/Route.Bucket");
app.use("/", BucketRoutes);

const AuthRoute = require("./Routes/Route.Auth");
app.use("/auth", AuthRoute);

const BucketSettingsRoute = require("./Routes/Route.Settings");
app.use("/setting", BucketSettingsRoute);

const BucketRequestsRoute = require("./Routes/Route.Request");
app.use("/request", BucketRequestsRoute);

const BucketItemsRoute = require("./Routes/Route.Items");
app.use("/item", BucketItemsRoute);

/*---------------------------------------------------*/
// Error Handling
app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.send({
    status: err.status,
    message: err.message,
  });
});

/*---------------------------------------------------*/
//Listening
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Node app running at ${PORT}`);
  });
});
