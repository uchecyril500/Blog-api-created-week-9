const Joi = require("joi");
const ArticleModel = require("../models/article.model");

// =========================
// UPDATED VALIDATION SCHEMAS
// =========================
const createArticleSchema = Joi.object({
  header: Joi.string().min(5).required(),
  subHeader: Joi.string().min(5).optional(),
  title: Joi.string().min(5).required(),
  content: Joi.string().min(20).required(),
  author: Joi.string().allow("").optional(),
});

const updateArticleSchema = Joi.object({
  header: Joi.string().min(5).optional(),
  subHeader: Joi.string().min(5).optional(),
  title: Joi.string().min(5).optional(),
  content: Joi.string().min(20).optional(),
  author: Joi.string().allow("").optional(),
}).min(1);



// =========================
// CREATE ARTICLE
// =========================
const postArticle = async (req, res, next) => {
  const { error, value } = createArticleSchema.validate(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // If author is missing or empty, set default
  if (!value.author || value.author.trim() === "") {
    value.author = "Guest";
  }

  try {
    const newArticle = new ArticleModel(value);
    await newArticle.save();

    return res.status(201).json({
      message: "Article created successfully",
      data: newArticle,
    });
  } catch (err) {
    next(err);
  }
};



// =========================
// GET ALL ARTICLES (with pagination)
// =========================
const getAllArticle = async (req, res, next) => {
  let limit = Number(req.query.limit);
  let page = Number(req.query.page);

  if (!limit || limit < 1) limit = 10;
  if (!page || page < 1) page = 1;

  const skip = (page - 1) * limit;

  try {
    const articles = await ArticleModel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return res.status(200).json({
      message: "Articles fetched successfully",
      page,
      limit,
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};


// =========================
// GET ARTICLE BY ID
// =========================
const getArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: `Article with ID ${req.params.id} not found`,
      });
    }

    return res.status(200).json({
      message: "Article found",
      data: article,
    });
  } catch (err) {
    next(err);
  }
};


// =========================
// UPDATE ARTICLE BY ID
// =========================
const updateArticleById = async (req, res, next) => {
  const { error, value } = updateArticleSchema.validate(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

    // Apply default author BEFORE updating
      if (value.author === "") {
        value.author = "Guest";
    }

    try {

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({
        message: `Article with ID ${req.params.id} not found`,
      });
    }

    return res.status(200).json({
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (err) {
    next(err);
  }
};


// =========================
// DELETE ARTICLE BY ID
// =========================
const deleteArticleById = async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: `Article with ID ${req.params.id} not found`,
      });
    }

    return res.status(200).json({
      message: "Article deleted successfully",
      deleted: article
    });
  } catch (err) {
    next(err);
  }
};




// =========================
// SEARCH ARTICLES BY KEYWORD
// =========================
const searchArticles = async (req, res, next) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search query 'q' is required" });
  }

  try {
    const results = await ArticleModel.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    return res.status(200).json({
      message: "Search results",
      query: q,
      count: results.length,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};



// =========================
// EXPORT CONTROLLER
// =========================
module.exports = {
  postArticle,
  getAllArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById,
  searchArticles,
};
