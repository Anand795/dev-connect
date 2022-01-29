const jwt = require("jsonwebtoken");
const config = require("config");
const { model } = require("mongoose");

module.exports = function (req, res, next) {
  // Get token from the headers.
  const token = req.header("x-auth-token");

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: "No Token, Authoraizaition denied" });
  }

  // verify token
  try {
    jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    console.error("something wrong with auth middleware: ", error);
    res.status(500).json({ msg: "Server error" });
  }
};
