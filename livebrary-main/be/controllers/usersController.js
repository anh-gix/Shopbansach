const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { SECRET_KEY } = require("../middlewares/middleware");

exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newUser = new User({ email, username, password: hashed });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res
      .status(200)
      .json({ message: "Login successful", user: user.toObject(), token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.status(200).json({ users, message: "Successfully!" });
    } else {
      res.status(404).json({ message: "No users found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error: error });
  }
};

exports.editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, password, status } = req.body;
    const update = { username, status, updatedAt: Date.now() };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ message: "successfully", user });
    } else {
      res.status(201).json({
        message: "not found!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
