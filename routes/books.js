const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["title", "ASC"]] });
    res.render("all-books", { title: "Our Book Shop", books });
  })
);

/* GET new books page */
router.get("/books/new", (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});

/* POST new book */
router.post(
  "/books",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books/" + book.id);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        console.log(error.name);
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
        console.log(errors);
      } else {
        throw error;
      }
    }
  })
);

/* Get details of a specific book */
router.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      res.render("book-detail", { book, title: book.title });
    } else {
      const err = new Error("Sorry - This page does not exist");
      res.render("page-not-found", { err });
    }
  })
);

/* Edit book form page */
router.get(
  "/books/:id/update",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book, title: book.title });
    } else {
      const err = new Error("Sorry - This page does not exist");
      res.render("page-not-found", { err });
    }
  })
);

/* Update book. */
router.post(
  "/books/:id/update",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books/" + book.id);
      } else {
        const err = new Error("Sorry - This page does not exist");
        res.render("page-not-found", { err });
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("books/update", {
          book,
          errors: error.errors,
          title: "Update Book",
        });
      } else {
        throw error;
      }
    }
  })
);

/* Delete individual article. */
router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      const err = new Error("Sorry - This page does not exist");
      res.render("page-not-found", { err });
    }
  })
);

module.exports = router;
