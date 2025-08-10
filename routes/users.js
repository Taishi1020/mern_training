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

module.exports = router;