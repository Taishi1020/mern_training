const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/uploads")
const path = require("path");
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
require("dotenv").config();

// データベース接続
mongoose.connect(process.env.MONGURL)
.then(() => console.log("データベース接続成功"))
.catch((err) => console.log(err));


// ミドルウェア
// パス指定
app.use("/images", express.static(path.join(__dirname, "public/images")));
// ボディパーサー
app.use(express.json());
// ルート
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/uploads", uploadRoute);



app.listen(port, () => {
  console.log(`サーバーが起動しました ${port}`);
});
