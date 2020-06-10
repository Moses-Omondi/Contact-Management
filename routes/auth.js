const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const config = require("config");
const auth = require("../middleware/auth");

const { validationResult, check } = require("express-validator");

// route    GET api/auth
// desc     Get a logged in user
// access   Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { 
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// route    POST api/auth
// desc     Auth user and get token
// access   Public
router.post(
  "/",
  [
    // Validation and Sanitization.
    check("email", "Please enter your email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //Checking if user exists.
      let user = await User.findOne({ email });

      // User not found.
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Compare registered password to login password
      const isMatch = await bcrypt.compare(password, user.password);

      // User exists but wrong password
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Send token if available
      const payload = {
        user: {
          id: user.id
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
