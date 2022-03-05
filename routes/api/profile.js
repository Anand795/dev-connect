const express = require("express");
const axios = require("axios");
const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { response } = require("express");

// @route       GET api/profile/me
// @desc        get current user's profile
// @access      Private
router.get("/me", auth, async (req, res) => {
  try {
    //  populate methode is used to get the user info from the user collection
    // first param is the model name and the second is the field name
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/profile
// @desc        Create or update user profile
// @access      Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;

    // Build profile object
    const profileObject = {};
    profileObject.user = req.user.id;
    if (company) profileObject.company = company;
    if (website) profileObject.website = website;
    if (location) profileObject.location = location;
    if (bio) profileObject.bio = bio;
    if (status) profileObject.status = status;
    if (githubusername) profileObject.githubusername = githubusername;
    if (skills) {
      profileObject.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object
    profileObject.social = {};
    if (youtube) profileObject.social.youtube = youtube;
    if (twitter) profileObject.social.twitter = twitter;
    if (instagram) profileObject.social.instagram = instagram;
    if (linkedin) profileObject.social.linkedin = linkedin;
    if (facebook) profileObject.social.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // update the profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileObject },
          { new: true }
        );
        return res.json(profile);
      }

      // create a new profile
      profile = new Profile(profileObject);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }

    console.log(profileObject.skills);
    // res.send("hello");
  }
);

// @route       GET api/profile
// @desc        get all profilesx
// @access      Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       GET api/profile/user/:user_id
// @desc        Get profile by user ID
// @access      Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route       DELETE api/profile
// @desc        Delete profil, user, posts
// @access      Public
router.delete("/", auth, async (req, res) => {
  try {
    // todo - remove users posts
    // remove User posts
    await Post.deleteMany({ user: req.user.id });

    // Delte profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // Detele user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       PUT api/profile/experience
// @desc        Add profile experience
// @access      Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the request from the body
    const { title, company, location, from, to, current, description } =
      req.body;

    // build the experience object eg: title: title, company: company
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      // ushift is used to add the new experience to the beginning of the array whereas push adds to the end
      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       DELETE api/profile/experience/:exp_id
// @desc        Delete experience from profile
// @access      Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    // GET remove index
    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();

    return res.status(200).json(foundProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ------------------------------------------------------------------------------------------

// @route       PUT api/profile/education
// @desc        Add profile education
// @access      Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the request from the body
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    // build the education object eg: title: title, company: company
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      // ushift is used to add the new education to the beginning of the array whereas push adds to the end
      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       DELETE api/profile/education/:edu_id
// @desc        Delete education from profile
// @access      Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.education = foundProfile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );

    await foundProfile.save();

    return res.status(200).json(foundProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       GET api/profile/github/:username
// @desc        Get User repos from Github
// @access      Public
router.get("/github/:username", async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      "user-agent": "node.js",
      Authorization: `token ${config.get("githubToken")}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: "No Github profile found" });
  }
});

module.exports = router;
