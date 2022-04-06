const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");

const corsMW = require("./middlewares/corsMW");
const errorMW = require("./middlewares/errorMW");

const authRoutes = require("./routes/authRoutes");
const rvmRoutes = require("./routes/rvmRoutes");
const scrapRoutes = require("./routes/scrapRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsMW);

app.use("/auth", authRoutes);
app.use("/rvm", rvmRoutes);
app.use("/scraps", scrapRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);

app.use(errorMW);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0zw4e.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true`
  )
  .then((result) => {
    console.log("Connected to MongoDB");
    const server = app.listen(process.env.PORT || 8000);
    const io = require("./utils/socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected ", socket.id);
      socket.on("disconnect", (reason) => console.log(reason));
    });
  })
  .catch((err) => console.log(err));
