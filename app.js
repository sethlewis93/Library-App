const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
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
const books = require("./routes/books");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/books", books);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).render("page-not-found");
});

/* ERROR HANDLERS */

/* Global error handler */
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).render("page-not-found", { err });
  } else {
    err.message = "An error has occured";
    err.status = 500;
    res.render("error", { err });
  }
});

module.exports = app;
