import express from "express";
import morgan from "morgan";
import createError from "http-errors";

import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.json({ message: "Welcome to my API" });
});

app.use("/api", authRoutes);

app.use(async (req, res, next) => {
  // const error = new Error('Not Found')
  // error.status = 404
  // next(error)
  // next(new createError.NotFound('This route does not exists'))
  next(new createError.NotFound());
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status,
      message: err.message,
    },
  });
});

export { app };
