const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactsRouter = require("./routes/contacts.js");
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// JSON parser
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/contacts", contactsRouter);

// Test root route
app.get("/", (req, res) => res.send("Server and MongoDB working!"));

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
