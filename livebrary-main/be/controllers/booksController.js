const mongoose = require("mongoose");
const Book = require("../models/book");
const Order = require("../models/order");

exports.createBook = async (req, res) => {
  try {
    const { title, author, description, genre, publicationYear, publicationDate, image, price, stock, publisher } =
      req.body;

    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      return res.status(400).json({ message: "Book title already exists" });
    }

    // Basic validation for publicationYear
    const pubYearNum = Number(publicationYear || (publicationDate ? new Date(publicationDate).getFullYear() : undefined));
    if (!Number.isInteger(pubYearNum) || pubYearNum < 0 || pubYearNum > new Date().getFullYear()) {
      return res.status(400).json({ message: "Năm xuất bản không hợp lệ" });
    }

    const computedStatus = Number(stock) <= 0
      ? "out_of_stock"
      : Number(stock) <= 5
      ? "low_stock"
      : "in_stock";

    const newBook = new Book({
      title,
      author,
      description,
      genre,
      publicationYear: pubYearNum,
      publicationDate: publicationDate ? new Date(publicationDate) : undefined,
      image,
      price,
      stock,
      status: computedStatus,
      publisher,
    });
    await newBook.save();
    res
      .status(200)
      .json({ message: "Book created successfully", book: newBook });
  } catch (err) {
    res.status(500).json({ message: "Error creating book", error: err });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", error: err });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: "Error fetching book", error: err });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if this book exists in any order items
    const orderHasBook = await Order.findOne({ "items.book": id }).lean();
    if (orderHasBook) {
      return res
        .status(400)
        .json({ message: "Không thể xóa sách vì đang tồn tại trong đơn hàng" });
    }
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book", error: err });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, author, description, genre, publicationYear, publicationDate, image, price, stock, sku, isbn, publisher } =
      req.body;
    const { id } = req.params;

    // Basic validation for publicationYear
    const pubYearNum = Number(publicationYear || (publicationDate ? new Date(publicationDate).getFullYear() : undefined));
    if (!Number.isInteger(pubYearNum) || pubYearNum < 0 || pubYearNum > new Date().getFullYear()) {
      return res.status(400).json({ message: "Năm xuất bản không hợp lệ" });
    }

    const computedStatus = Number(stock) <= 0
      ? "out_of_stock"
      : Number(stock) <= 5
      ? "low_stock"
      : "in_stock";

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author,
        description,
        genre,
        publicationYear: pubYearNum,
        publicationDate: publicationDate ? new Date(publicationDate) : undefined,
        image,
        price,
        stock,
        status: computedStatus,
        publisher,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } catch (err) {
    res.status(500).json({ message: "Error updating book", error: err });
  }
};

exports.getBooksByFilter = async (req, res) => {
  try {
    const { title } = req.params;

    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const books = await Book.find(filter);

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with the given filter" });
    }

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", error: err });
  }
};

exports.getBooksByGenre = async (req, res) => {
  try {
    const genreId = req.params.genreId;

    if (!mongoose.Types.ObjectId.isValid(genreId)) {
      return res.status(400).json({ message: "Invalid genre ID" });
    }

    const books = await Book.find({ genre: genreId });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found for this genre" });
    }

    res.status(200).json(books);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching books by genre", error: err });
  }
};
