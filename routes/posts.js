const router = require("express").Router()
const Post = require("../models/Post");
const User = require("../models/User");

// 投稿の作成
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (error) {
    return res.status(500).json(error);
  }
})

// 投稿の更新する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId) {
      await post.updateOne({$set: req.body});
      return res.status(200).json("投稿編集に成功しました。");
    } else {
      return res.status(403).json("あなたはこの投稿を更新できません。");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

// 投稿の削除
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("投稿を削除しました。");
    } else {
      return res.status(403).json("あなたはこの投稿を削除できません。");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

// 投稿の取得
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
})

// 投稿のいいね
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // 投稿にいいねしていない場合
    if(!post.likes.includes(req.body.userId)) {
      await post.updateOne({$push: {likes: req.body.userId}});
      return res.status(200).json("投稿にいいねしました。");
    } else {
      await post.updateOne({$pull: {likes: req.body.userId}});
      return res.status(200).json("投稿のいいねを解除しました。");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
})

// タイムラインの取得
router.get("/timeline/:userId", async (req,res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    // 自分の投稿を取得
    const userPosts = await Post.find({userId: currentUser._id});
    // フォローしているユーザーの投稿を取得
    const friendPosts = await Promise.all(currentUser.followings.map(friendId => {
      return Post.find({userId: friendId});
    }));
    // 自分の投稿とフォローしているユーザーの投稿を結合して返す
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    return res.status(500).json(error);
  }
})


// プロフィール専用のタイムラインの取得
router.get("/profile/:username", async (req,res) => {
  try {
    const user = await User.findOne({username: req.params.username});
    const posts = await Post.find({userId: user._id});
    // フォローしているユーザーの投稿を取得
    // 自分の投稿とフォローしているユーザーの投稿を結合して返す
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
})


module.exports = router;