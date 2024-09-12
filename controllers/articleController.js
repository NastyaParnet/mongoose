const Article = require('../models/articleModel');

exports.getAllArticles = async () => {};

exports.getArticle = async () => {};

exports.postArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    const result = await article.save();
    res.status(201).json({
      status: 'success',
      data: {
        article: result,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: {
        error,
      },
    });
  }
};

exports.patchArticle = async () => {};

exports.deleteArticle = async () => {};

exports.threeMostLiked = async () => {};

exports.viewsCountByTheme = async () => {};
