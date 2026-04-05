const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Post content is required'],
        maxLength: [500, 'Post content cannot exceed 500 characters']
    },
    recommendation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendation'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
