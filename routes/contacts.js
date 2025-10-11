const Contact = require('../models/contacts');
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

// GET contact by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

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

// POST new contact
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, phone } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        message: "All fields (firstName, lastName, email, phone) are required.",
      });
    }

    // Insert the contact into MongoDB
    const result = await mongoose.connection.db
      .collection("contacts")
      .insertOne({ firstName, lastName, email, favoriteColor, phone });

    // Return new contact _id
    res.status(201).json({
      message: "Contact created successfully",
      _id: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating contact:", err);
    res.status(500).json({ message: "Error creating contact" });
  }
});

// update contact - PUT
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        message: "All fields (firstName, lastName, email, phone) are required."
      });
    }

    const result = await Contact.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phone },
      { new: true } // returns updated document
    );

    if (!result) {
      return res.status(404).json({ message: "Contact not found." });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      contact: result
    });
  } catch (err) {
    console.error("Error updating contact:", err);
    res.status(500).json({ message: "Error updating contact", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Attempt to delete the contact by ID
    const result = await Contact.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Contact not found." });
    }

    res.status(200).json({
      message: "Contact deleted successfully",
      _id: id
    });
  } catch (err) {
    console.error("Error deleting contact:", err);
    res.status(500).json({ message: "Error deleting contact", error: err.message });
  }
});

module.exports = router;
