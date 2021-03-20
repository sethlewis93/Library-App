var express = require("express");
var router = express.Router();
const Book = require("../models/book").Book;

/* GET home page. */
router.get("/", async function (req, res, next) {
  const books = await Book.findAll();
  res.json(books);
  console.log(books);
});
module.exports = router;
