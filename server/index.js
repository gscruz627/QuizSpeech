import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authController from "./controllers/authController.js";


const app = express();
dotenv.config();

const MONGO_URI = process.env.MONGO_URI

app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("hi");
})

app.use("/auth", authController)
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
})

// custom error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

mongoose.connect(MONGO_URI).catch((err) => {
    console.log("MongoDB connection has proudly fallen, reason: " + err);
}).then(() => {
    console.log("MongoDB has sucessfully connected!");
    console.log("App listening on: 8000");
    app.listen(8000);
})