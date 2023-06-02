const { getUserFavorites, setFavorite } = require("../controllers/Favorites");
const app = require("express").Router();

app.get("/:id", getUserFavorites);

app.post("/", setFavorite);

module.exports = app;
