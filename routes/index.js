const express = require("express");
const router = express.Router();
const Book = require("../models").Book;
const { Op } = require("sequelize");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(error.status).send(error);
    }
  };
}

/* GET home page. */
router.get("/", (req, res, next) => {
  res.redirect("/books");
});

router.get(
  "/books",
  asyncHandler(async (req, res, next) => {
    const books = await Book.findAll({ order: [["genre", "DESC"]] });
    res.render("all-books", { title: "Our Book Shop", books });
  })
);

/* Create a new book. */
router.get("/books/new", (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books/" + book.id);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("books/new", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        throw error;
      }
    }
  })
);

router.get("/books/:id", (res, req, next) => {
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/book-detail", { book, title: "Book Detail" });
    } else {
      res.sendStatus(404);
    }
  });
});

/* Update an article. */
router.post(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books/" + book.id);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("books/edit", {
          book,
          errors: error.errors,
          title: "Edit Book",
        });
      } else {
        throw error;
      }
    }
  })
);

/* Delete individual article. */
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  })
);

/* GET generated error route - create and throw 500 server error */
// router.get("/error", (req, res, next) => {
//   // Log out custom error handler indication
//   console.log("Custom error route called");
//   const err = new Error();
//   err.message = `Custom 500 error thrown`;
//   err.status = 500;
//   res.render("error", { err });
//   throw err;
// });

/* GET individual book route */

module.exports = router;
