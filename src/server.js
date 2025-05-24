import express from "express";
import cors from "cors";
import noteRouter from "./routes/note-router.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectToDatabase from "./config/database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", noteRouter);

app.listen(4444);
