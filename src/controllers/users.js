const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const login = async (req, res) => {
  try {
    const data = req.body;
    console.log(data)
    const user = await User.findByEmail(data.email);
    console.log(user)
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
    console.log(req.body);
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));

    data.password = await bcrypt.hash(data.password, salt);

    console.log(data);
    const newUser = await User.create(data);

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
    const user = await User.findById(req.user);
    res
      .status(200)
      .json({ username: user.username});
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

module.exports = { login, register, showStats, tokenValidation };