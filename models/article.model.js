const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      minLength: 3,
    },
  },
  { timestamps: true }
);

const articleSchema = new mongoose.Schema(
  {
    header: {
      type: String,
      required: true,
      minLength: 5,
    },
    subHeader: {
      type: String,
      minLength: 5,
    },
    title: {
      type: String,
      required: true,
      minLength: 5,
    },
    content: {
      type: String,
      required: true,
      minLength: 20,
    },
    author: {
      type: String,
      default: "Guest",
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Text index for search
articleSchema.index({
  header: "text",
  subHeader: "text",
  title: "text",
  content: "text",
  author: "text",
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
