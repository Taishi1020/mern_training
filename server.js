const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const port = 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// ミドルウェア
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
  console.log(`サーバーが起動しました ${port}`);
});
