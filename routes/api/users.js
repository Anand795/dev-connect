const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator"); // froentend validations like isEmila, password length

// @route       POST api/users
// @desc        Register User
// @access      Public
router.post(
  "/",
  [
    // First Parm is property and 2nd is error message
    check("name", "Name is Required"  ).not().isEmpty(),
    check("email", "Please Include valid Email").isEmail(),
    check(
      "password",
      "please enter password with 6 or more charcters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    // in order to work req.body -> we have to initialize the middlewhare for the body parser
    // I have done it in the server.js file   
    console.log(req.body);
    // Set Error response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("User route");
  }
);

module.exports = router;
