const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// @route       GET api/auth
// @desc        Test Route
// @access      Public
router.get("/", auth, async (req, res) => {
  try {
    // remember to use async await
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route       GET api/auth
// @desc        Login, Authenticate User & get token
// @access      Public
router.post(
  "/",
  [
    // First Parm is property and 2nd is error message
    check("email", "Please Include valid Email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // in order to work req.body -> we have to initialize the middlewhare for the body parser
    // I have done it in the server.js file
    console.log(req.body);
    // Set Error response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if the user exists
      let user = await User.findOne({ email }); // const user = await User.findOne({ email: email })

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Compare method from bcrypt compares the password from the user and the encrypted password from the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (err, token) => {
          console.info(res);
          if (err) {
            console.error(err);
            throw err;
          }
          res.json({ token });
        }
      );
      // jwt.sign(
      //   payload,
      //   config.get('jwtSecret'),
      //   { expiresIn: '5 days' },
      //   (err, token) => {
      //     if (err) throw err;
      //     res.json({ token });
      //   }
      // );
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
