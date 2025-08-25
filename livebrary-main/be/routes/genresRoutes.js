const express = require("express");
const router = express.Router();
const genresController = require("../controllers/genresController");
const { verifyToken } = require("../middlewares/middleware");

router.post("/createGenres", verifyToken, genresController.createGenre);
router.get("/getAllGenres", genresController.getGenres);
router.delete("/deleteGenres/:id", genresController.deleteGenreById);
router.put("/updateGenres/:id", genresController.updateGenreById);
router.get("/:id", genresController.getGenreById);

module.exports = router;
