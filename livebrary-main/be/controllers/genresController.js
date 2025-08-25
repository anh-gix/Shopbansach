const Genre = require("../models/genres");
const Book = require("../models/book");

exports.createGenre = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).json({ message: "Genre name already exists" });
    }
    const newGenre = new Genre({ name, description });
    await newGenre.save();
    res
      .status(201)
      .json({ message: "Genre created successfully", genre: newGenre });
  } catch (err) {
    res.status(500).json({ message: "Error creating genre", error: err });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (err) {
    res.status(500).json({ message: "Error fetching genres", error: err });
  }
};

exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }
    res.status(200).json(genre);
  } catch (err) {
    res.status(500).json({ message: "Error fetching genre", error: err });
  }
};

exports.deleteGenreById = async (req, res) => {
  try {
    const genreId = req.params.id;
    const booksWithGenre = await Book.find({ genre: genreId });
    if (booksWithGenre.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete genre because it is associated with one or more books",
      });
    }
    const genre = await Genre.findByIdAndDelete(genreId);
    if (!genre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    res.status(200).json({ message: "Genre deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting genre", error: err });
  }
};

exports.updateGenreById = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Tìm thể loại hiện tại
    const currentGenre = await Genre.findById(req.params.id);
    if (!currentGenre) {
      return res.status(404).json({ message: "Genre not found" });
    }

    // Kiểm tra name chỉ khi name mới khác name cũ
    if (name && name !== currentGenre.name) {
      const existingGenre = await Genre.findOne({ name });
      if (existingGenre) {
        return res.status(400).json({ message: "Genre name already exists" });
      }
    }

    // Cập nhật genre
    currentGenre.name = name || currentGenre.name;
    currentGenre.description = description || currentGenre.description;
    await currentGenre.save();

    res
      .status(200)
      .json({ message: "Genre updated successfully", genre: currentGenre });
  } catch (err) {
    res.status(500).json({ message: "Error updating genre", error: err });
  }
};
