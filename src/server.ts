import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
require("dotenv").config();

import userRoutes from "./routes/user";
import favRoute from "./routes/favs";

console.log("uri", process.env.MONGO_URI);
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

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

app.get("/", (_, res) => {
  res.send("Hello World");
});
app.use("/api/", userRoutes);
app.use("/fav/", favRoute);

app.listen(process.env.PORT, async () => {
  console.log("server running");
});
