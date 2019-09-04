const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  async register(req, res) {
    try {
      const newUser = {
        username: req.body.username,
        email: req.body.email
      };

      if (!newUser.username || !newUser.email || !req.body.password) {
        return res
          .status(400)
          .json({ errors: ["The username, email and password is required."] });
      }

      const emailExists = await User.findOne({ email: req.body.email });

      if (emailExists) {
        return res.status(400).json({ errors: ["The email already exists."] });
      }

      newUser.password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create(newUser);
      user.password = undefined;
      return res.status(201).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: ["Um erro ocorreu no sistema"] });
    }
  },
  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user === null) {
        return res.status(404).json({ errors: ["Email not found."] });
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({ errors: ["Password not found."] });
      }

      const payload = {
        id: user.id,
        email: user.email,
        username: user.username
      };

      const token = jwt.sign(payload, process.env.JWT_SESSION || "amoeba", {
        expiresIn: "7d"
      });
      return res.json({
        token,
        ...payload
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: ["Um erro ocorreu no sistema"] });
    }
  }
};
