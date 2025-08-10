const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
require("dotenv").config();

// データベース接続
mongoose.connect(process.env.MONGURL)
.then(() => console.log("データベース接続成功"))
.catch((err) => console.log(err));


// ミドルウェア
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`サーバーが起動しました ${port}`);
});
