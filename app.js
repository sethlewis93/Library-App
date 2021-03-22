const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sequelize = require("./models/index").sequelize;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection to the database successful!");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
})();

const indexRouter = require("./routes/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const error = new Error();
  error.status = 404;
  next(error);
});

/* ERROR HANDLERS */

/* Global error handler */
app.use((err, req, res, next) => {
  if (err.status === 404) {
    err.message = "This page does not exist";
    res.status(404).render("page-not-found", { err });
  } else {
    err.message = "There has been a problem on the server";
    err.status = 500;
    res.render("error", { err });
    console.log(`Status: ${err.status}, Message: ${err.message}`);
  }
});

module.exports = app;
