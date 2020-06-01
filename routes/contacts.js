const express = require("express");
const auth = require("../middleware/auth");
const { validationResult, check } = require("express-validator");
const router = express.Router();

const User = require("../model/User");
const Contact = require("../model/Contact");

// route    GET api/contacts
// desc     Get all users contacts
// access   Public
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route    POST api/contacts
// desc     Add new contact
// access   Private
router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        });

        const contact = await newContact.save();

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

  }
);

// route    PUT api/contacts/:id
// desc     Add contact
// access   Private
router.put("/:id", (req, res) => {
  res.send("Update contact");
});

// route    DELETE api/contacts/:id
// desc     Delete contact
// access   Private
router.delete("/:id", (req, res) => {
  res.send("Delete contact");
});

module.exports = router;
