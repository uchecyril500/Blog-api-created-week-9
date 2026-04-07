const express = require("express");
const router = express.Router();
const {
  postArticle,
  getAllArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById,
  searchArticles,
} = require("../controllers/article.controller");

// Create article
router.post("/articles", postArticle);

// Get all articles
router.get("/articles", getAllArticle);

// Search articles
router.get("/articles/search", searchArticles);

// Get article by ID
router.get("/articles/:id", getArticleById);

// Update article
router.patch("/articles/:id", updateArticleById);

// Delete article
router.delete("/articles/:id", deleteArticleById);

module.exports = router;
