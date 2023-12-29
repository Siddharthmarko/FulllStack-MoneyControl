const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");

const router = require(path.join(__dirname, "./Routes/utils/router.js"));
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require('compression')

app.use(compression()) // compress all responses
app.use(express.json()); // parse incoming request body as JSON
app.use(bodyParser.urlencoded({ extended: true })); // parse Outgoing request body as JSON
app.use(cookieParser());
app.use(cors()); //Handling Cors Error
app.use(router);
app.set("view engine", 'ejs')// Add Node js Template Engine

app.use(function (req, res) {
  const err = new Error("Not Found");
  err.status = 404;
  res.json(err);
});
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');

async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1); // Exit gracefully on connection failure
  }
}

// Handle MongoDB connection events
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  try {
    
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    await mongoose.disconnect(); // Disconnect MongoDB if server fails to start
    process.exit(1); // Exit gracefully
  }
});

// Initiate the connection process
connectToDatabase();
