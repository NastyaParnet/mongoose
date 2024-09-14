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

exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        article: article,
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

exports.patchArticle = async (req, res) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, req.body);
    const article = await Article.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        article,
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

exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        article: null,
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

exports.threeMostLiked = async (req, res) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 3;
    const articles = await Article.find().sort('title');
    const result = articles
      .sort((article1, article2) =>
        article1.rating > article2.rating ? -1 : 1
      )
      .map((article) => ({
        title: article.title,
        commentsCount: article.comments.length,
        rating: +(article.rating - 1).toFixed(15),
      }))
      .slice(0, limit);
    res.status(200).json({
      status: 'success',
      data: {
        count: result.length,
        result,
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

exports.viewsCountByTheme = async () => {};
