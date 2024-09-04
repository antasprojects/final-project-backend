const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const login = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findByEmail(data.email);
    const match = await bcrypt.compare(data.password, user.password_hash);
    console.log("match", match);
    if (!match) throw new Error("Unable to authenticate");

    jwt.sign(
      { user_id: user.user_id },
      process.env.SECRET_KEY,
      {
        expiresIn: 3600,
      },
      (err, data) => {
        if (err) {
          res.status(500).json({ error: "Error generating token" });
        } else {
          res.status(200).json({ token: data });
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const register = async (req, res) => {
  const data = req.body;
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));

    password_hash = await bcrypt.hash(data.password, salt);

    data_with_hash = {
      username: data.username,
      email: data.email,
      password_hash: password_hash
    }

    const newUser = await User.create(data_with_hash);

    jwt.sign(
      { user_id: newUser.user_id },
      process.env.SECRET_KEY,
      {
        expiresIn: 3600,
      },
      (err, data) => {
        if (err) {
          res
            .status(500)
            .json({ success: false, error: "Error generating token" });
        } else {
          res.status(201).json({ token: data });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(404).send({ error: err });
  }
};

const showStats = async (req, res) => {
  try {
      const user = await User.findById(req.user_id);  // Retrieve user_id from the request object
      res.status(200).json({ username: user.username });
  } catch (err) {
      res.status(404).json({ error: err.message });
  }
};


const tokenValidation = (req, res) => {
  if (req.user) {
    res.status(200).json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
};

// Controller to save a location
const saveLocation = async (req, res) => {
  try {

      const user_id = req.user_id; // Retrieve user_id from the request object
      const { place_id } = req.body; // Get place_id from the request body
      await User.saveLocation(user_id, place_id);
      res.status(201).json({ message: 'Location saved successfully' });
  } catch (err) {
      res.status(500).json({ error: 'Failed to save location' });
  }
};

// Controller to get saved locations for a user
const getSavedLocations = async (req, res) => {
  try {
      const user_id = req.user_id;  // Retrieve user_id from the request object
      const savedLocations = await User.getSavedLocations(user_id);
      res.status(200).json({ savedLocations });
  } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve saved locations' });
  }
};

// Controller to recommend a location to another user
const recommendLocation = async (req, res) => {
  try {

    const recommender_user_id = req.user_id

    const { username, place_id, message } = req.body; // Get details from the request body

    const user = await User.findByUsername(username)

    const recommendation = await User.recommendLocation(recommender_user_id, user.user_id, place_id, message);

    console.log(recommendation);
    res.status(201).json({ message: 'Location recommended successfully', recommendation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to recommend location' });
  }
};


// Controller to get recommendations for a user
const getRecommendations = async (req, res) => {
  try {
    const user_id = req.user_id;  // Retrieve user_id from the request object
    const recommendations = await User.getRecommendationsForUser(user_id);

    res.status(200).json({ recommendations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve recommendations' });
  }
};



module.exports = { login, register, showStats, tokenValidation, saveLocation, 
  getSavedLocations, recommendLocation, getRecommendations
 };