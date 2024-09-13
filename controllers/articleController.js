const Article = require('../models/articleModel');

exports.getAllArticles = async (req, res) => {
  try {
    let filters = {};
    let pagination = {};
    let sort = '';
    Object.entries(req.query).forEach(([param, value]) => {
      if (typeof value === 'object') {
        const [[operator, val]] = Object.entries(value);
        filters = { ...filters, [param]: { [`$${operator}`]: +val } };
      } else if (param === 'sort') {
        const fields = value.split(',');
        sort = fields.join(' ');
      } else if (param === 'limit') {
        pagination = { ...pagination, limit: +value };
      } else if (param === 'page') {
        pagination = { ...pagination, skip: +req.query.limit * (value - 1) };
      } else {
        filters = { ...filters, [param]: value };
      }
    });
    const result = await Article.find(filters, null, pagination).sort(sort);
    res.status(200).json({
      status: 'success',
      data: {
        count: result.length,
        articles: result,
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
