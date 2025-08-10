const router = require("express").Router()
const User = require("../models/User")

//CRUD
// ユーザー情報の更新
router.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.body.userId, {
                $set: req.body,
            });
            res.status(200).json("ユーザー情報が更新されました。");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントのときだけ更新できます。");
    }
    
})

// ユーザー情報の削除
router.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("ユーザー情報を削除しました。")
        } catch (error) {
           return res.status(500    ).json(err);
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントのときだけ削除できます。");
    }
})

// ユーザー情報の取得
router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // パスワードと更新日時を除いて、ユーザー情報を返す
        const { password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        return res.status(500).json(error);
    }
})

//  ユーザーをフォローする
router.put("/:id/follow", async (req, res) => {
    // 自分のユーザーIDと対象のユーザーIDが一致しない場合
    if(req.body.userId !== req.params.id) {
        try {
            // 相手：対象のユーザー
            const user = await User.findById(req.params.id);
            // 自分：フォローするユーザー
            const currentUser = await User.findById(req.body.userId);
            // 相手のフォロワーに自分が含まれていない場合
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: { followers: req.body.userId},
                })
                // 自分のフォローリストに相手が含まれていない場合
                await currentUser.updateOne({
                    $push: { followings: req.params.id},
                })
                return res.status(200).json("フォローしました。");
            } else {
                return res.status(403).json("あなたはすでこのユーザーをフォローしています。");
            }

        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("自分自身をフォローすることはできません。");
    }
})

module.exports = router;