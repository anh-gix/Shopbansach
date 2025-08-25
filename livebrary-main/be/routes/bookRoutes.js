const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

const { verifyToken } = require("../middlewares/middleware");
router.post("/addBook", booksController.createBook);
router.get("/getAllBook", booksController.getBooks);
router.get("/filter/:title", booksController.getBooksByFilter);
router.get("/genre/:genreId", booksController.getBooksByGenre);
router.delete("/deleteBook/:id", verifyToken, booksController.deleteBook);
router.put("/updateBook/:id", verifyToken, booksController.updateBook);
router.get("/:id", booksController.getBookById);

module.exports = router;
