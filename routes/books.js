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
    res.render("books/all-books", { title: "Our Book Shop", books });
  })
);

/* GET new books page */
router.get("/new", (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* POST new book */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        return res.render("books/new-book", {
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

/* Get details of a specific book */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      res.render("books/book-detail", { book, title: book.title });
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "Sorry - This page does not exist";
      next(err);
    }
  })
);

/* Edit book form page */
router.get(
  "/:id/update",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/update-book", { book, title: book.title });
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "Sorry - This page does not exist";
      next(err);
    }
  })
);

/* Update book. */
router.post(
  "/:id/update",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/");
      } else {
        const err = new Error();
        err.status = 404;
        err.message = "Sorry - This page does not exist";
        next(err);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("books/update-book", {
          book,
          errors: error.errors,
          title: book.title,
        });
      } else {
        throw error;
      }
    }
  })
);

/* Delete individual book. */
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/");
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "Sorry - This page does not exist";
      next(err);
    }
  })
);

module.exports = router;
