const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const router = express.Router();

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await mongoose.connection.db
      .collection("contacts")
      .find()
      .toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Convert string ID to ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const contact = await mongoose.connection.db
      .collection("contacts")
      .findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (err) {
    console.error("Error fetching contact:", err);
    res.status(500).json({ message: "Error fetching contact" });
  }
});

module.exports = router;
