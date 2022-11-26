const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// COnnect database
connectDB();

// Init middlewahare in order for req.body to work
app.use(express.json({ extended: false }));

// app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/post"));

// Serve static assets in production
// EDIT-1: Since heroku has depcrated we are using cyclic.sh
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// will get the port number from heroku and by default it is 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
