const Favorite = require('../models/favorite');


exports.addToFavorites = async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const newFavorite = new Favorite({ userId, bookId });
        await newFavorite.save();
        res.status(201).json({ message: "Book added to favorites", favorite: newFavorite });
    } catch (err) {
        res.status(500).json({ message: "Error adding book to favorites", error: err });
    }
};


exports.getFavoritesByUser = async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.params.userId });
        res.status(200).json(favorites);
    } catch (err) {
        res.status(500).json({ message: "Error fetching favorites", error: err });
    }
};
exports.deleteFavorite = async (req, res) => {
    try {
        const { userId, bookId } = req.params; 

        const deletedFavorite = await Favorite.findOneAndDelete({ userId, bookId });
        
        if (!deletedFavorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        res.status(200).json({ message: "Favorite deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting favorite", error: err });
    }
};

