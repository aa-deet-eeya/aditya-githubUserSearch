import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
require("dotenv").config();

import userRoutes from "./routes/user";
import favRoute from "./routes/favs";

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB Not Connected", err);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// app.get("/", (_, res) => {
//   res.send("Hello World");
// });

app.use(express.static(`${__dirname}/../client/build`));

app.use("/api/", userRoutes);
app.use("/fav/", favRoute);

app.get("*", (req, res) => {
  res.sendFile(`${__dirname}/../client/build/index.html`);
});

app.listen(process.env.PORT, async () => {
  console.log("server running");
});
