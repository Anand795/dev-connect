const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator"); // froentend validations like isEmila, password length
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route       POST api/users
// @desc        Register User
// @access      Public
router.post(
  "/",
  [
    // First Parm is property and 2nd is error message
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Please Include valid Email").isEmail(),
    check(
      "password",
      "please enter password with 6 or more charcters"
    ).isLength({ min: 6 }),
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

    const { name, email, password } = req.body;

    try {
      // See if the user exists
      let user = await User.findOne({ email }); // const user = await User.findOne({ email: email })

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exists" }] });
      }

      // get the user gravitor
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt the password

      // Since we are using async, anything that uses promise we must make sure we use await
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Sav the user
      await user.save();

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
