const Post = require('../models/post');
const Community = require('../models/community');
const User = require('../models/user');


exports.createPost = async (req, res) => {
    try {
        const { title, content, communityId, userId } = req.body;

        
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newPost = new Post({
            title,
            content,
            communityId,
            userId
        });

        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (err) {
        res.status(500).json({ message: "Error creating post", error: err });
    }
};


exports.getPostsByCommunity = async (req, res) => {
    try {
        const posts = await Post.find({ communityId: req.params.communityId }).populate('userId', 'username email').populate('communityId', 'name description');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching posts", error: err });
    }
};


exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('userId', 'username email').populate('communityId', 'name description');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: "Error fetching post", error: err });
    }
};
exports.updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;

    
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,  
            { title, content, updatedAt: Date.now() },  
            { new: true }  
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (err) {
        res.status(500).json({ message: "Error updating post", error: err });
    }
};
exports.deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting post", error: err });
    }
};


