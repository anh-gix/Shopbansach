const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
    required: true,
  },
  publicationDate: {
    type: Date,
  },
  publicationYear: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        const currentYear = new Date().getFullYear();
        return Number.isInteger(value) && value >= 0 && value <= currentYear;
      },
      message: "Năm xuất bản không hợp lệ",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  // e-commerce fields
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["in_stock", "low_stock", "out_of_stock"],
    default: "in_stock",
  },
  publisher: {
    type: String
  }
});

module.exports = mongoose.model("Book", bookSchema);
