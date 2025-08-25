const Review = require('../models/review');


exports.addReview = async (req, res) => {
    try {
        const { bookId, userId, rating, review } = req.body;
        const newReview = new Review({ bookId, userId, rating, review });
        await newReview.save();
        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (err) {
        res.status(500).json({ message: "Error adding review", error: err });
    }
};


exports.getReviewsByBook = async (req, res) => {
    try {
        const reviews = await Review.find({ bookId: req.params.bookId });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reviews", error: err });
    }
};
