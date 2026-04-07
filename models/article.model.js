const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 5,
    },
    content: {
      type: String,
      required: true,
      minLength: 20
    },
    author: {
      type: String,
      default: "Guest"
    }
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
