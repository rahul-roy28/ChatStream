import User from "../models/user.model.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserByUsername:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create user (join chat)
export const createUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if user already exists
    let user = await User.findOne({ username });

    if (user) {
      // User exists, just return it
      return res.status(200).json(user);
    }

    // Create new user
    user = await User.create({ username });
    res.status(201).json(user);
  } catch (error) {
    console.log("Error in createUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
