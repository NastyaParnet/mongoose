const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  evaluation: {
    type: String,
    enum: {
      values: ['like', 'dislike'],
      message: '{VALUE} is not supported',
    },
  },
  content: String,
  lastChangedAt: Date,
});

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [10, 'Title should be longer than 10 characters'],
    },
    theme: {
      type: String,
      required: true,
      enum: {
        values: ['trips', 'shopping', 'beauty', 'art', 'food'],
        message: '{VALUE} is not supported',
      },
    },
    description: String,
    viewsCount: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
    lastChangedAt: Date,
  },
  {
    toJSON: { virtuals: true },
  }
);

articleSchema.virtual('likesQuantity').get(function () {
  return this.comments.filter(
    (comment) => comment.evaluation === 'like'
  ).length;
});

articleSchema.virtual('dislikesQuantity').get(function () {
  return this.comments.filter(
    (comment) => comment.evaluation === 'dislike'
  ).length;
});

articleSchema.virtual('rating').get(function () {
  const totalComments = this.comments.length;
  if (totalComments === 0) return 0;
  const likes = this.likesQuantity;
  const dislikes = this.dislikesQuantity;
  return (likes - dislikes) / totalComments + 1;
});

commentSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    this.content = this.content.trim();
  }
  this.lastChangedAt = Date.now();
  next();
});

articleSchema.pre('save', function (next) {
  if (this.isModified('description')) {
    this.description = this.description.trim();
  }
  this.lastChangedAt = Date.now();
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
