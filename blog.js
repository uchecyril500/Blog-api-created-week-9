require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const connectDB = require('./database/connectDB');
const RequestLogger = require("./Middlewares/logger");
const errorhandler = require("./Middlewares/errorhandler");
const ArticleRoutes = require('./routes/article.route');

connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(RequestLogger);

// Routes
app.use('/api', ArticleRoutes);

// Error handler LAST
app.use(errorhandler);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
